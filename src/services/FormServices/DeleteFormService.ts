import { Form } from "@prisma/client";
import prisma from "../../prisma";
import AppError from "../../errors/AppError";

interface Response {
  form: Form;
}

const DeleteFormService = async (id: number): Promise<Response> => {
  const form = await prisma.form.delete({
    where: {
      id: id,
    },
  });

  if (!form) {
    throw new AppError("form not found", 404);
  }

  return {
    form,
  };
};
export default DeleteFormService;
