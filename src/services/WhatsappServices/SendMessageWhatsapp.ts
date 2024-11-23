import { whatsappClient } from "../../utils/whatsapp";

interface Response {
  status: boolean;
}

const SendMessageWhatsapp = async (message: string): Promise<Response> => {
  const sent = await whatsappClient
    ?.sendText("201274029801@g.us", message)
    .then((result) => {
      console.log("Result: ", result); //return object success
    })
    .catch((erro) => {
      console.error("Error when sending: ", erro); //return object error
    });

  return sent ? { status: true } : { status: false };
};

export default SendMessageWhatsapp;
