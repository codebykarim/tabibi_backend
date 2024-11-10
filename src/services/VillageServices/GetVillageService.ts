import { Village } from "@prisma/client";
import prisma from "../../prisma";

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
    throw new Error("Village not found");
  }

  return {
    village,
  };
};
export default GetVillageService;
