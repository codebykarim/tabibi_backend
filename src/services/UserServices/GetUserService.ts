import { User } from "@prisma/client";
import prisma from "../../prisma";

interface Response {
  user: User;
}

const GetUserService = async (id: number): Promise<Response> => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return {
    user,
  };
};

export default GetUserService;
