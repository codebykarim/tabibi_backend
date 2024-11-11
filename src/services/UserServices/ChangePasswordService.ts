import { User } from "@prisma/client";
import { supabase } from "../../utils/supabase";
import AppError from "../../errors/AppError";
import prisma from "../../prisma";
import { updateTokenExpiry } from "../../utils/tokenUtils";

interface Response {
  user: User;
  token: string;
}

const ChangePasswordService = async (
  identitynumber: string,
  oldPassword: string | undefined = process.env.DEFAULT_PASSWORD,
  newPassword: string
): Promise<Response> => {
  const alreadyChangedPassword = await prisma.user.findFirst({
    where: {
      identitynumber: identitynumber,
      changedPassword: true,
    },
  });

  if (alreadyChangedPassword) {
    throw new AppError("Sorry Already password changed", 406);
  }

  const user = await prisma.user.update({
    where: {
      identitynumber: identitynumber,
    },
    data: {
      changedPassword: true,
    },
  });

  if (!user) {
    throw new AppError("Sorry Invalid user", 406);
  }

  const { data, error } = await supabase.rpc("verify_user_password", {
    password: oldPassword ?? process.env.DEFAULT_PASSWORD,
    auth_id: user.authId,
  });

  if (!data || error) {
    throw new AppError("Sorry Invalid password", 406);
  }
  await supabase.auth.admin.updateUserById(user.authId, {
    password: newPassword,
  });

  const { data: authData } = await supabase.auth.signInWithPassword({
    email: `${identitynumber}@tabibi.com`,
    password: newPassword,
  });

  const token = updateTokenExpiry(authData!.session!.access_token, user.id);

  return {
    user,
    token,
  };
};

export default ChangePasswordService;
