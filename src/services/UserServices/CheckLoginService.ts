import AppError from "../../errors/AppError";
import prisma from "../../prisma";

const CheckLoginService = async (identitynumber: string): Promise<void> => {
  const user = await prisma.user
    .findFirst({
      where: {
        identitynumber: identitynumber,
        isverified: true,
      },
    })
    .catch((e) => {
      console.log(e);
      throw new AppError("Sorry Something went wrong");
    });

  if (!user) {
    throw new AppError("Sorry we can't find your account");
  }

  if (!user.isverified) {
    throw new AppError("Sorry your account is not verified yet");
  }

  return;
};

export default CheckLoginService;
