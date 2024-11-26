import { Form, Request } from "@prisma/client";
import prisma from "../../prisma";
import AppError from "../../errors/AppError";

interface Response {
  forms: Form[];
}

const GetFormsService = async (): Promise<Response> => {
  const forms = await prisma.form.findMany({
    where: {
      userId: {
        not: null,
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!forms) {
    throw new AppError("FORMS_NOT_FOUND", 404);
  }

  return {
    forms,
  };
};
export default GetFormsService;
