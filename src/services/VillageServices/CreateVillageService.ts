import { Village } from "@prisma/client";
import prisma from "../../prisma";
import AppError from "../../errors/AppError";

interface Response {
  village: Village;
}

const CreateVillageService = async ({
  name,
  location,
}: {
  name: string;
  location: string;
}): Promise<Response> => {
  const villageWithSameName = await prisma.village.findFirst({
    where: {
      name: name,
    },
  });

  if (villageWithSameName) {
    throw new AppError("Village already exists", 400);
  }

  const village: Village = await prisma.village
    .create({
      data: {
        name,
        location,
      },
    })
    .catch(async (e) => {
      throw new AppError("ERR_ADMIN_CREATE", 404);
    });

  return {
    village,
  };
};

export default CreateVillageService;
