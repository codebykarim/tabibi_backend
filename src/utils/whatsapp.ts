import { create, Whatsapp } from "venom-bot";
import AppError from "../errors/AppError";

let whatsappClient: Whatsapp | null = null;

/**
 * Initialize WhatsApp Client
 */
export const connectAndGetQrCode = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    create(
      `whatsapp`,
      (base64Qr) => {
        resolve(base64Qr);
      },
      undefined,
      { autoClose: 1000, logQR: true }
    )
      .then((client) => {
        whatsappClient = client;
      })
      .catch(reject);
  });
};

export { whatsappClient };
