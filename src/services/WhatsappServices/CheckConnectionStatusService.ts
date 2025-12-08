import { checkConnectionStatus } from "../../utils/whatsapp";

interface Response {
  status: boolean;
}

const CheckConnectionStatusService = async (
  adminId: number
): Promise<Response> => {
  const connected = await checkConnectionStatus(adminId);

  return connected ? { status: true } : { status: false };
};

export default CheckConnectionStatusService;
