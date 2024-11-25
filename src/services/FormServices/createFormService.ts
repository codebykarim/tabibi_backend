import { Form, FormType } from "@prisma/client";
import prisma from "../../prisma";
import AppError from "../../errors/AppError";
import SendMessageWhatsapp from "../WhatsappServices/SendMessageWhatsapp";

interface CreateFormArgs {
  type: FormType;
  formData: Partial<Omit<Form, "id" | "type" | "createdAt">>; // Allow partial data
}

interface Response {
  form: Form;
}

const CreateForm = async ({
  type,
  formData,
}: CreateFormArgs): Promise<Response> => {
  if (!type || !formData) {
    throw new AppError("Please provide all required inputs", 400);
  }

  try {
    const form = await prisma.form.create({
      data: {
        type,
        ...formData,
      },
      include: {
        user: true,
      },
    });

    const admin = await prisma.admin.findFirst({});

    if (!admin) {
      return { form };
    }

    const whatsappForm = Object.entries(formData)
      .filter(
        ([key, value]) =>
          value !== null &&
          value !== "" &&
          value !== undefined &&
          key !== "media" &&
          key !== "userId"
      )
      .map(([key, value]) => `*${key}*: ${value}`)
      .join("\n");

    const message = `📝 *New Form ${form.user?.identitynumber} - ${form.user?.name}*\n\n${whatsappForm}`;

    await SendMessageWhatsapp(message, admin.id, form.media, form.user?.name);

    return { form };
  } catch (error) {
    console.error("Error creating form:", error);
    throw new AppError("Failed to create form. Please try again later.", 500);
  }
};

export default CreateForm;
