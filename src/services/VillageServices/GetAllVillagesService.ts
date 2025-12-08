import { Village } from "@prisma/client";
import prisma from "../../prisma";

interface Response {
  villages: Village[];
}

const GetAllVillagesService = async (): Promise<Response> => {
  const villages = await prisma.village.findMany();

  return {
    villages,
  };
};
export default GetAllVillagesService;
