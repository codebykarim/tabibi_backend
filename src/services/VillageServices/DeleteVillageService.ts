import { Village } from "@prisma/client";
import prisma from "../../prisma";
import AppError from "../../errors/AppError";

interface Response {
  village: Village;
}

const DeleteVillageService = async (id: number): Promise<Response> => {
  const village = await prisma.village.delete({
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
export default DeleteVillageService;
