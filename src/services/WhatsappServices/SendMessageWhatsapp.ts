import prisma from "../../prisma";
import WhatsAppService from "../../utils/whatsapp";

interface Response {
  status: boolean;
}

const SendMessageWhatsapp = async (
  userId: number,
  message: string
): Promise<Response> => {
  const admin = await prisma.admin.findFirst({});

  if (!admin) {
    return { status: false };
  }

  const sent = await WhatsAppService.sendMessageToGroup(
    admin.whatsappGroupId!,
    message
  );

  return sent ? { status: true } : { status: false };
};

export default SendMessageWhatsapp;
