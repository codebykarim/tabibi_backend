import { connectAndGetQrCode } from "../../utils/whatsapp";

interface Response {
  qr: string;
}

const GetQrCodeService = async (): Promise<Response> => {
  const qr = await connectAndGetQrCode();

  return { qr };
};

export default GetQrCodeService;
