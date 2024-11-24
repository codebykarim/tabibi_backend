import { Client, LocalAuth } from "whatsapp-web.js";
import { unlinkSync, existsSync } from "fs";

class WhatsAppService {
  private client: Client | null = null;
  private readonly sessionPath = "/whatsapp/tokens/whatsapp-session"; // Session folder
  private readonly lockFile = `${this.sessionPath}/SingletonLock`;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    this.cleanUpLockFile();
    this.createClient();

    try {
      await this.client?.initialize();
      console.log("WhatsApp initialized successfully!");
    } catch (err) {
      console.error("Error initializing WhatsApp client:", err);
    }
  }

  private cleanUpLockFile(): void {
    if (existsSync(this.lockFile)) {
      try {
        unlinkSync(this.lockFile);
        console.log("SingletonLock file removed successfully.");
      } catch (err) {
        console.error("Error removing SingletonLock file:", err);
      }
    }
  }

  private createClient(): void {
    this.client = new Client({
      authStrategy: new LocalAuth({ clientId: "whatsapp-session" }),
      puppeteer: {
        headless: true,
        // executablePath: "/usr/bin/chromium",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
        ],
      },
    });

    this.client.on("ready", () => console.log("WhatsApp client is ready!"));
    this.client.on("authenticated", () =>
      console.log("WhatsApp authenticated!")
    );
    this.client.on("disconnected", (reason) =>
      console.log("WhatsApp client disconnected:", reason)
    );
  }

  private async ensureClientInitialized(): Promise<void> {
    if (!this.client) {
      console.log("Reinitializing WhatsApp client...");
      await this.initialize();
    }
  }

  async getQRCode(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        return reject("Client is not ready");
      }

      this.client.on("qr", (qr) => resolve(qr));
    });
  }

  async getConnectionStatus(): Promise<string> {
    await this.ensureClientInitialized();
    try {
      return (await this.client?.getState()) ?? "disconnected";
    } catch (err) {
      console.error("Error fetching connection status:", err);
      return "error";
    }
  }

  async getAllGroups(): Promise<any[]> {
    await this.ensureClientInitialized();

    if (!this.client) {
      throw new Error("Client not connected");
    }

    const chats = await this.client.getChats();
    return chats.filter((chat) => chat.isGroup);
  }

  async sendMessageToGroup(groupId: string, message: string): Promise<string> {
    await this.ensureClientInitialized();

    if (!this.client) {
      throw new Error("Client not connected");
    }

    await this.client.sendMessage(groupId, message);
    return "Message sent!";
  }
}

export default new WhatsAppService();
