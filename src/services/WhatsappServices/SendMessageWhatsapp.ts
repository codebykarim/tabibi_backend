import prisma from "../../prisma";
import { whatsappClient } from "../../utils/whatsapp";

interface Response {
  status: boolean;
}

const SendMessageWhatsapp = async (
  userId: number,
  message: string
): Promise<Response> => {
  const admin = await prisma.admin.findFirst({
    where: {
      id: userId,
    },
  });
  if (!admin) {
    return { status: false };
  }
  const sent = await whatsappClient
    ?.sendText(admin?.whatsappGroupId!, message)
    .then((result: any) => {
      console.log("Result: ", result); //return object success
    })
    .catch((erro: any) => {
      console.error("Error when sending: ", erro); //return object error
    });

  return sent ? { status: true } : { status: false };
};

export default SendMessageWhatsapp;
