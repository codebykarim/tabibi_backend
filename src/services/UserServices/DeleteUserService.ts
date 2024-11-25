import { Gender, User } from "@prisma/client";
import AppError from "../../errors/AppError";
import prisma from "../../prisma";
import { supabase } from "../../utils/supabase";

interface Response {
  success: boolean;
}

const DeleteUserService = async (id: number): Promise<Response> => {
  const user = await prisma.user
    .delete({
      where: {
        id: id,
      },
    })
    .then(async (data) => {
      const { error } = await supabase.auth.admin.deleteUser(data.authId);

      if (error) throw new AppError("Sorry something went wrong", 400);

      await prisma.request.deleteMany({
        where: {
          userId: data.id,
        },
      });

      return {
        success: true,
      };
    })

    .catch((e) => {
      throw new AppError("Sorry Something went wrong");
    });

  return {
    success: true,
  };
};

export default DeleteUserService;
