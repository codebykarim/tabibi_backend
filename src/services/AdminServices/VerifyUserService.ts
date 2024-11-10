import { User } from "@prisma/client";
import prisma from "../../prisma";

interface Response {
  user: User;
}

const VerifyUserService = async (id: number): Promise<Response> => {
  const user = await prisma.user.update({
    data: {
      isverified: true,
    },
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
export default VerifyUserService;
