import prisma from "../../prisma";
import WhatsAppService from "../../utils/whatsapp";

interface Response {
  status: boolean;
}

const CheckFullConnectionStatusService = async (
  userId: number
): Promise<Response> => {
  const admin = await prisma.admin.findFirst({});

  if (!admin) {
    return { status: false };
  }

  const connected = await WhatsAppService.getConnectionStatus();

  return connected && admin.whatsappGroupId
    ? { status: true }
    : { status: false };
};

export default CheckFullConnectionStatusService;
