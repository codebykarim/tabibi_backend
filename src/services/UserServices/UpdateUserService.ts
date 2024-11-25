import { User } from "@prisma/client";
import AppError from "../../errors/AppError";
import prisma from "../../prisma";

interface Response {
  user: User;
}

const UpdateUserService = async ({
  data,
}: {
  data: Partial<User>; // Allow partial updates
}): Promise<Response> => {
  const user = await prisma.user
    .update({
      where: {
        id: data.id,
      },
      data,
    })
    .then(async (user) => {
      await prisma.request.deleteMany({
        where: {
          userId: user.id,
        },
      });
      return user;
    });

  if (!user) {
    throw new AppError("Sorry, invalid user", 406);
  }

  return {
    user,
  };
};

export default UpdateUserService;
