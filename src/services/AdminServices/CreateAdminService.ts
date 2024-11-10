import AppError from "../../errors/AppError";
import prisma from "../../prisma";
import { Admin, AdminRole } from "@prisma/client";
import { supabase } from "../../utils/supabase";
import { updateTokenExpiry } from "../../utils/tokenUtils";

interface NewUser {
  email: string;
  password: string;
  name: string;
  role: string;
}

interface Permissions {
  tableName: string;
  read: boolean;
  create: boolean;
  update: boolean;
  remove: boolean;
}

interface Response {
  admin: Admin;
  token: string;
}

const CreateAdminService = async ({
  email,
  password,
  name,
  role = AdminRole.ADMIN,
}: NewUser): Promise<Response> => {
  const adminWithSameEmail = await prisma.admin.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
  });

  if (adminWithSameEmail) {
    throw new AppError("ADMIN_EXISTS", 400);
  }

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        role: role === "DOCTOR" ? AdminRole.DOCTOR : AdminRole.ADMIN,
      },
    },
  });

  if (error) throw new AppError("ERR_INVALID_CREDENTIALS", 400);

  const admin: Admin = await prisma.admin
    .create({
      data: {
        authId: data!.user!.id,
        email,
        name,
        role: role === "DOCTOR" ? AdminRole.DOCTOR : AdminRole.ADMIN,
      },
    })
    .catch(async (e) => {
      await supabase.auth.admin.deleteUser(data!.user!.id);
      throw new AppError("ERR_ADMIN_CREATE", 404);
    });

  await supabase.auth.admin.updateUserById(data!.user!.id, {
    user_metadata: { id: admin.id },
  });

  const newToken = updateTokenExpiry(data!.session!.access_token, admin.id);

  return {
    admin,
    token: newToken,
  };
};

export default CreateAdminService;
