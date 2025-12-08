import { Admin } from "@prisma/client";
import prisma from "../../prisma";
import AppError from "../../errors/AppError";
import { supabase } from "../../utils/supabase";
import { updateTokenExpiry } from "../../utils/tokenUtils";

interface Response {
  admin: Admin;
  token: string;
}

const LoginAdminService = async (
  email: string,
  password: string
): Promise<Response> => {
  const admin = await prisma.admin.findFirst({
    where: {
      email: email,
    },
  });

  if (!admin) {
    throw new AppError("Sorry we can't find your account", 404);
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) throw new AppError("Sorry your password is incorrect", 400);

  const token = updateTokenExpiry(data!.session!.access_token, admin.id);

  return {
    admin,
    token: token,
  };
};

export default LoginAdminService;
