import { whatsappClient } from "../../utils/whatsapp";

interface Response {
  status: boolean;
}

const CheckConnectionStatusService = async (): Promise<Response> => {
  if (!whatsappClient) {
    return { status: false };
  }
  const connected = await whatsappClient?.isConnected();

  return connected ? { status: true } : { status: false };
};

export default CheckConnectionStatusService;
