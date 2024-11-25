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

let clients: Record<number, any> = {}; // Store clients by adminId

export const connectToWhatsApp = async (adminId: number) => {
  // Return existing client if already connected
  if (clients[adminId]) return clients[adminId];

  const { state, saveCreds } = await useMultiFileAuthState(
    `/whatsapp/auth_info_baileys_${adminId}`
  );

  const conn = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  conn.ev.on("creds.update", saveCreds);

  conn.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    const status = (lastDisconnect?.error as Boom)?.output?.statusCode;

    if (status === DisconnectReason.restartRequired) {
      console.log("Restarting connection...");
      connectToWhatsApp(adminId); // Reconnect for the same user
    }

    if (connection === "open") {
      console.log(`Connection opened for adminId: ${adminId}`);
      clients[adminId] = conn; // Store the client for the adminId
    }

    if (connection === "close") {
      console.log(`Connection closed for adminId: ${adminId}`);
      delete clients[adminId]; // Remove client on disconnect
    }
  });

  return new Promise((resolve, reject) => {
    conn.ev.on("connection.update", (update) => {
      if (update.connection === "open") resolve(conn);
    });

    setTimeout(() => {
      reject(new Error("Connection timed out"));
    }, 30000);
  });
};

// Generate QR code function
export const generateQrCode = async (adminId: number) => {
  const client = await connectToWhatsApp(adminId);

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
export const checkConnectionStatus = async (adminId: number) => {
  const client = await connectToWhatsApp(adminId);

  if (!client) {
    throw new AppError("Client not connected");
  }

  return client.user && client.user.id;
};

// Check if user is fully connected and can receive messages
export const checkFullyConnection = async (adminId: number) => {
  const client = await connectToWhatsApp(adminId);
  if (!client) {
    throw new AppError("Client not connected");
  }

  const user = await prisma.admin.findUnique({
    where: {
      id: adminId,
    },
  });
  const groupId = user?.whatsappGroupId;
  console.log("\n\n\n\n\n\n" + groupId + "\n\n\n\n\n\n" + client.user?.id);
  return client.user && client.user.id && groupId;
};

// Fetch WhatsApp groups function
export const fetchGroups = async (adminId: number) => {
  const client = await connectToWhatsApp(adminId);

  if (!client) {
    throw new AppError("Client not connected");
  }

  const chats = await client.groupFetchAllParticipating();
  return Object.values(chats);
};

// Send message to group function
export const sendMessage = async (
  message: string,
  whatsappGroupId: string,
  adminId: number
) => {
  const client = await connectToWhatsApp(adminId);

  if (!client) {
    throw new AppError("Client not connected");
  }

  await client.sendMessage(whatsappGroupId, {
    text: message,
  });

  return true;
};

export const disconnectWhatsAppAndRemoveAuthInfo = async (adminId: number) => {
  try {
    await prisma.admin.update({
      where: {
        id: adminId,
      },
      data: {
        whatsappGroupId: null,
      },
    });
    await fs.promises.rmdir(`/whatsapp/auth_info_baileys_${adminId}`, {
      recursive: true,
    });
    console.log("Authentication info removed successfully.");
    return true;
  } catch (error) {
    console.error("Error removing authentication info:", error);
    return false;
  }
};
