import prisma from "../../prisma";
import { sendMessage } from "../../utils/whatsapp";

interface Response {
  status: boolean;
}

const SendMessageWhatsapp = async (
  message: string,
  userId: number
): Promise<Response> => {
  const admin = await prisma.admin.findFirst({
    where: {
      id: userId,
    },
  });

  if (!admin) {
    return { status: false };
  }

  const sent = await sendMessage(message, admin.whatsappGroupId!);

  console.log(sent, "sent");

  return sent ? { status: true } : { status: false };
};

export default SendMessageWhatsapp;
