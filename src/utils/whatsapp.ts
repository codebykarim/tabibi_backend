import makeWASocket, {
  BufferJSON,
  useMultiFileAuthState,
  DisconnectReason,
  Browsers,
  ConnectionState,
} from "@whiskeysockets/baileys";
import * as fs from "fs";
import { Boom } from "@hapi/boom";
import prisma from "../prisma";
import AppError from "../errors/AppError";

let client: any = null; // Store the single WhatsApp client

export const connectToWhatsApp = async () => {
  if (client) return client; // Return existing client if already connected

  // Initialize the multi-file authentication state
  const { state, saveCreds } = await useMultiFileAuthState(
    "/whatsapp/auth_info_baileys"
  );

  // Create a socket connection
  const conn = makeWASocket({
    auth: state,
    // printQRInTerminal: true,
  });

  // Save credentials on update
  conn.ev.on("creds.update", saveCreds);

  // Handle connection updates
  conn.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    const status = (update.lastDisconnect?.error as Boom)?.output?.statusCode;

    if (status == DisconnectReason.restartRequired) {
      console.log("Restarting connection...");
      connectToWhatsApp(); // Reconnect if required
    }

    // If disconnected, log the disconnect reason
    if (lastDisconnect?.error) {
      console.log("Disconnected:", lastDisconnect.error);
    }

    // When the connection opens
    if (connection === "open") {
      console.log("Opened connection to WhatsApp");
      client = conn; // Store the client once the connection is open
    }
  });

  return conn; // Return the client
};

export const generateQrCode = async () => {
  const client = await connectToWhatsApp();

  if (!client) {
    throw new AppError("Client not connected");
  }

  return new Promise((resolve) => {
    client.ev.on("connection.update", (update: Partial<ConnectionState>) => {
      const { qr, connection } = update;
      console.log(qr);
      if (qr) {
        resolve(qr); // Return QR code as base64 string
      } else if (connection === "open") {
        console.log("Connection opened successfully.");
      }
    });
  });
};

// Check connection status
export const checkConnectionStatus = async () => {
  const client = await connectToWhatsApp();

  if (!client) {
    throw new AppError("Client not connected");
  }

  return client.user && client.user.id;
};

// Check if user is fully connected and can receive messages
export const checkFullyConnection = async (userId: number) => {
  const client = await connectToWhatsApp();
  if (!client) {
    throw new AppError("Client not connected");
  }

  const user = await prisma.admin.findUnique({
    where: {
      id: userId,
    },
  });
  const groupId = user?.whatsappGroupId;
  console.log("\n\n\n\n\n\n" + groupId + "\n\n\n\n\n\n" + client.user?.id);
  return client.user && client.user.id && groupId;
};

// Fetch WhatsApp groups function
export const fetchGroups = async () => {
  const client = await connectToWhatsApp();

  if (!client) {
    throw new AppError("Client not connected");
  }

  const chats = await client.groupFetchAllParticipating();
  return Object.values(chats);
};

// Send message to group function
export const sendMessage = async (message: string, whatsappGroupId: string) => {
  const client = await connectToWhatsApp();

  if (!client) {
    throw new AppError("Client not connected");
  }

  await client.sendMessage(whatsappGroupId, {
    text: message,
  });

  return true;
};
