import prisma from "../../prisma";
import { sendMessage } from "../../utils/whatsapp";

interface Response {
  status: boolean;
}

const SendMessageWhatsapp = async (
  message: string,
  adminId: number
): Promise<Response> => {
  const admin = await prisma.admin.findFirst({
    where: {
      id: adminId,
    },
  });

  if (!admin) {
    return { status: false };
  }

  const sent = await sendMessage(message, admin.whatsappGroupId!, adminId);

  return sent ? { status: true } : { status: false };
};

export default SendMessageWhatsapp;
