import prisma from "../../prisma";
import { checkFullyConnection } from "../../utils/whatsapp";

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

  const connected = await checkFullyConnection(userId);

  return connected && admin.whatsappGroupId
    ? { status: true }
    : { status: false };
};

export default CheckFullConnectionStatusService;
