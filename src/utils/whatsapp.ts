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

export const connectToWhatsApp = async (adminId: number) => {
  if (client) return client; // Return existing client if already connected

  // Initialize the multi-file authentication state
  const { state, saveCreds } = await useMultiFileAuthState(
    `/whatsapp/auth_info_baileys_${adminId}`
  );

  // Create a socket connection
  const conn = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  // Save credentials on update
  conn.ev.on("creds.update", saveCreds);

  // Handle connection updates
  conn.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    const status = (update.lastDisconnect?.error as Boom)?.output?.statusCode;

    if (status == DisconnectReason.restartRequired) {
      console.log("Restarting connection...");
      connectToWhatsApp(adminId); // Reconnect if required
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

  return new Promise((resolve, reject) => {
    conn.ev.on("connection.update", (update) => {
      return resolve(conn); // Resolve the promise when connection is open
    });

    setTimeout(() => {
      reject(new Error("Connection timed out"));
    }, 30000); // Timeout after 30 seconds if no connection
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
