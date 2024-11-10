import { User } from "@prisma/client";
import prisma from "../../prisma";
import { supabase } from "../../utils/supabase";
import { updateTokenExpiry } from "../../utils/tokenUtils";
import AppError from "../../errors/AppError";

interface Response {
  user: User;
  token: string;
}

const RegisterService = async (
  identitynumber: string,
  name: string,
  phone: string,
  village: string
): Promise<Response> => {
  const userWithSameIdentity = await prisma.user.findFirst({
    where: {
      identitynumber: identitynumber,
    },
  });

  if (userWithSameIdentity) {
    throw new AppError("Sorry user already exists", 400);
  }

  const { data, error } = await supabase.auth.signUp({
    email: `${identitynumber}@tabibi.com`,
    password: process.env.DEFAULT_PASSWORD!,
    options: {
      data: {
        name: name,
        identitynumber: identitynumber,
      },
    },
  });

  if (error) throw new AppError("Sorry something went wrong", 400);

  const user: User = await prisma.user
    .create({
      data: {
        authId: data!.user!.id,
        email: `${identitynumber}@tabibi.com`,
        identitynumber: identitynumber,
        phone: phone,
        village: village,
        name,
      },
    })
    .catch(async (e) => {
      await supabase.auth.admin.deleteUser(data!.user!.id);
      throw new AppError("ERR_ADMIN_CREATE", 404);
    });

  await supabase.auth.admin.updateUserById(data!.user!.id, {
    user_metadata: { id: user.id },
  });

  const newToken = updateTokenExpiry(data!.session!.access_token, user.id);

  return {
    user,
    token: newToken,
  };
};

export default RegisterService;
