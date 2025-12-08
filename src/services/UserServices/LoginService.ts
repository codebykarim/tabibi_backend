import { User } from "@prisma/client";
import prisma from "../../prisma";
import AppError from "../../errors/AppError";
import { supabase } from "../../utils/supabase";
import { updateTokenExpiry } from "../../utils/tokenUtils";

interface Response {
  user: User;
  token: string;
}

interface ResponseIfChangedPassword {
  changedPassword: boolean;
}

const LoginService = async (
  identitynumber: string,
  password: string
): Promise<Response | ResponseIfChangedPassword> => {
  const user = await prisma.user.findFirst({
    where: {
      identitynumber: identitynumber,
      isverified: true,
    },
  });

  if (!user) {
    throw new AppError("Sorry we can't find your account", 404);
  }

  if (!user.isverified) {
    throw new AppError("Sorry your account is not verified yet");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${identitynumber}@tabibbi.com`,
    password: password,
  });

  if (error) throw new AppError("Sorry your password is incorrect", 400);

  const token = updateTokenExpiry(data!.session!.access_token, user.id);

  if (!user.changedPassword) {
    return {
      changedPassword: user.changedPassword,
    };
  }

  return {
    user,
    token: token,
  };
};

export default LoginService;
