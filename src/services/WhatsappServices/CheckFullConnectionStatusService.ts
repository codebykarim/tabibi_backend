import prisma from "../../prisma";
import { checkFullyConnection } from "../../utils/whatsapp";

interface Response {
  status: boolean;
}

const CheckFullConnectionStatusService = async (
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

  const connected = await checkFullyConnection(adminId);

  return connected && admin.whatsappGroupId
    ? { status: true }
    : { status: false };
};

export default CheckFullConnectionStatusService;
