import { User } from "@prisma/client";
import prisma from "../../prisma";
import AppError from "../../errors/AppError";

interface Response {
  users: User[];
}

const GetUsersService = async (): Promise<Response> => {
  const users = await prisma.user.findMany({
    include: {
      village: true,
    },
    where: {
      isverified: true,
    },
  });

  if (!users) {
    throw new AppError("USERS_NOT_FOUND");
  }

  return {
    users,
  };
};

export default GetUsersService;
