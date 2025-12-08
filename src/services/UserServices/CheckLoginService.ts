import { User } from "@prisma/client";
import AppError from "../../errors/AppError";
import prisma from "../../prisma";

interface Response {
  user: User;
}

const CheckLoginService = async (identitynumber: string): Promise<Response> => {
  const user = await prisma.user
    .findFirst({
      where: {
        identitynumber: identitynumber,
      },
    })
    .catch((e) => {
      throw new AppError("Sorry Something went wrong");
    });

  if (!user) {
    throw new AppError("Sorry we can't find your account");
  }

  if (!user.isverified) {
    throw new AppError("Sorry your account is not verified yet");
  }

  return {
    user,
  };
};

export default CheckLoginService;
