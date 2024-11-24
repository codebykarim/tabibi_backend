import WhatsAppService from "../../utils/whatsapp";

interface Response {
  status: boolean;
}

const CheckConnectionStatusService = async (): Promise<Response> => {
  const connected = await WhatsAppService.getConnectionStatus();

  return connected ? { status: true } : { status: false };
};

export default CheckConnectionStatusService;
