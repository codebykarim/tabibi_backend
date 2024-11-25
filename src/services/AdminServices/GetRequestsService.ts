import { Request } from "@prisma/client";
import prisma from "../../prisma";
import AppError from "../../errors/AppError";

interface Response {
  requests: Request[];
}

const GetRequestsService = async (): Promise<Response> => {
  const requests = await prisma.request.findMany({
    where: {
      userId: {
        not: null,
      },
    },
    include: {
      user: {
        include: {
          village: true,
        },
      },
    },
  });

  if (!requests) {
    throw new AppError("USERS_NOT_FOUND", 404);
  }

  return {
    requests,
  };
};
export default GetRequestsService;
