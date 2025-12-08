import { Village } from "@prisma/client";
import prisma from "../../prisma";
import AppError from "../../errors/AppError";

interface Response {
  village: Village;
}

const GetVillageService = async (id: number): Promise<Response> => {
  const village = await prisma.village.findUnique({
    where: {
      id: id,
    },
  });

  if (!village) {
    throw new AppError("Village not found");
  }

  return {
    village,
  };
};
export default GetVillageService;
