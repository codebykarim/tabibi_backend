import { Admin } from "@prisma/client";
import prisma from "../../prisma";
import AppError from "../../errors/AppError";

interface Response {
  admin: Admin;
}

const GetAdminService = async (id: number): Promise<Response> => {
  const admin = await prisma.admin.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!admin) {
    throw new AppError("ADMIN_NOT_FOUND", 404);
  }

  return {
    admin,
  };
};
export default GetAdminService;
