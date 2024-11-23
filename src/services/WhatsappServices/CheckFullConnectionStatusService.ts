import prisma from "../../prisma";
import { whatsappClient } from "../../utils/whatsapp";

interface Response {
  status: boolean;
}

const CheckFullConnectionStatusService = async (
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

  if (!whatsappClient) {
    return { status: false };
  }

  const connected = await whatsappClient?.isConnected();

  return connected && admin.whatsappGroupId
    ? { status: true }
    : { status: false };
};

export default CheckFullConnectionStatusService;
