import { checkConnectionStatus } from "../../utils/whatsapp";

interface Response {
  status: boolean;
}

const CheckConnectionStatusService = async (): Promise<Response> => {
  const connected = await checkConnectionStatus();

  return connected ? { status: true } : { status: false };
};

export default CheckConnectionStatusService;
