import { generateQrCode } from "../../utils/whatsapp";

interface Response {
  qr: any;
}

const GetQrCodeService = async (): Promise<Response> => {
  const qr = await generateQrCode();

  return { qr };
};

export default GetQrCodeService;
