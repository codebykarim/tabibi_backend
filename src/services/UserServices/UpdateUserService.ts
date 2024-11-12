import { User } from "@prisma/client";
import { supabase } from "../../utils/supabase";
import AppError from "../../errors/AppError";
import prisma from "../../prisma";

interface Response {
  user: User;
}

const UpdateUserService = async (
  id: number,
  fcmToken: string
): Promise<Response> => {
  const user = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      fcmToken: fcmToken,
    },
  });

  if (!user) {
    throw new AppError("Sorry Invalid user", 406);
  }

  return {
    user,
  };
};

export default UpdateUserService;
