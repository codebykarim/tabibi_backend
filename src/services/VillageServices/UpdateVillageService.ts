import { Village } from "@prisma/client";
import prisma from "../../prisma";
import AppError from "../../errors/AppError";

interface Response {
  village: Village;
}

const UpdateVillageService = async (
  id: number,
  name: string,
  location: string
): Promise<Response> => {
  const village = await prisma.village.update({
    data: {
      name,
      location,
    },
    where: {
      id: id,
    },
  });

  if (!village) {
    throw new AppError("Village not found", 404);
  }

  return {
    village,
  };
};
export default UpdateVillageService;
