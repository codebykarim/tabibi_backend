import WhatsAppService from "../../utils/whatsapp";

interface Response {
  qr: string;
}

const GetQrCodeService = async (): Promise<Response> => {
  const qr = await WhatsAppService.getQRCode();

  return { qr };
};

export default GetQrCodeService;
