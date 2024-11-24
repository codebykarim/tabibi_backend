import { Client, LocalAuth } from "whatsapp-web.js";
import { unlinkSync, existsSync, rmSync, mkdirSync } from "fs";

class WhatsAppService {
  private client: Client | null = null;

  constructor() {
    this.initialize();
  }

  private sessionFolder = "/whatsapp/tokens"; // Docker path for tokens

  private async initialize(): Promise<void> {
    const sessionPath = "/whatsapp/tokens/whatsapp-session"; // Session folder
    const lockFile = `${sessionPath}/SingletonLock`;

    // Check and remove the SingletonLock file if it exists
    if (existsSync(lockFile)) {
      try {
        unlinkSync(lockFile); // Remove lock file to prevent errors
        console.log("SingletonLock file removed successfully.");
      } catch (err) {
        console.error("Error removing SingletonLock file:", err);
      }
    }

    // Initialize WhatsApp client using LocalAuth for session storage
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: "whatsapp-session", // Name for the session
      }),
      puppeteer: {
        headless: true, // Headless mode for Docker
        executablePath: "/usr/bin/chromium", // Pre-installed Chromium in Docker
        args: [
          "--no-sandbox", // Required for Docker
          "--disable-setuid-sandbox", // Prevents permission errors
          "--disable-dev-shm-usage", // Fixes shared memory crashes in Docker
        ],
      },
    });

    // Event listeners for client
    this.client.on("qr", (qr) => {
      console.log("QR Code received:", qr);
    });

    this.client.on("ready", () => {
      console.log("WhatsApp client is ready!");
    });

    this.client.on("authenticated", () => {
      console.log("WhatsApp authenticated!");
    });

    this.client.on("disconnected", (reason) => {
      console.log("WhatsApp client disconnected:", reason);
    });

    try {
      // Start client
      await this.client.initialize();
      console.log("WhatsApp initialized!");
    } catch (err) {
      console.error("Error initializing WhatsApp client:", err);
    }
  }

  private async reconnectClient(): Promise<void> {
    if (!this.client) {
      console.log("Reconnecting...");
      await this.initialize(); // Reinitialize if disconnected
    }
  }

  async getQRCode(): Promise<string> {
    // this.removeOldSession();

    return new Promise((resolve, reject) => {
      // Using the 'qr' event from whatsapp-web.js
      this.client?.on("qr", (qr) => {
        resolve(qr); // Return QR Code string
      });

      // If client is not ready or already authenticated
      if (!this.client) {
        reject("Client is not ready");
      }
    });
  }

  async getConnectionStatus(): Promise<string> {
    if (!this.client) return "disconnected";

    // Check client connection state
    const state = this.client.getState();
    return state;
  }

  async getAllGroups(): Promise<any[]> {
    await this.reconnectClient(); // Ensure the client is connected before making the request
    if (!this.client) throw new Error("Client not connected");

    const chats = await this.client.getChats();
    return chats.filter((chat) => chat.isGroup);
  }

  async sendMessageToGroup(groupId: string, message: string): Promise<string> {
    await this.reconnectClient(); // Ensure the client is connected before sending the message
    if (!this.client) throw new Error("Client not connected");

    await this.client.sendMessage(groupId, message);
    return "Message sent!";
  }

  // private removeOldSession(): void {
  //   const sessionPath = `${this.sessionFolder}`;
  //   if (existsSync(sessionPath)) {
  //     try {
  //       rmSync(sessionPath, { recursive: true, force: true }); // Delete the old session file
  //       console.log("Old session removed successfully.");
  //     } catch (err) {
  //       console.error("Error removing old session:", err);
  //     }
  //   } else {
  //     console.log("No existing session to remove.");
  //   }

  //   // Ensure the token folder itself exists
  //   if (!existsSync(sessionPath)) {
  //     try {
  //       mkdirSync(sessionPath, { recursive: true }); // Create token folder if missing
  //       console.log("Created session folder.");
  //     } catch (err) {
  //       console.error("Error creating session folder:", err);
  //     }
  //   }
  // }
}

export default new WhatsAppService();
