import { generateQrCode } from "../../utils/whatsapp";

interface Response {
  qr: any;
}

const GetQrCodeService = async (adminId: number): Promise<Response> => {
  const qr = await generateQrCode(adminId);

  return { qr };
};

export default GetQrCodeService;
