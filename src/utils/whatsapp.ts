import { create, Whatsapp, Chat } from "venom-bot";
import { unlinkSync, existsSync, rmdirSync, rmSync } from "fs";

class WhatsAppService {
  private client: Whatsapp | null = null;

  constructor() {
    this.initialize();
  }

  private sessionFolder = "./tokens"; // Path to session tokens folder
  private sessionName = "whatsapp-session";

  private async initialize(): Promise<void> {
    create(`whatsapp-session`, undefined, undefined, {
      headless: "new",
      folderNameToken: "tokens", // Persistent storage path
      mkdirFolderToken: "/usr/src/app/tokens", // Match the path created in the Dockerfile
      browserPathExecutable: "/usr/bin/chromium", // Pre-installed Chromium
      puppeteerOptions: {
        executablePath: "/usr/bin/chromium",
      },
      browserArgs: [
        "--no-sandbox", // Required for Docker
        "--disable-setuid-sandbox", // Prevents permission errors
        "--disable-dev-shm-usage", // Fixes shared memory crashes in Docker
      ],
      disableSpins: true,
      disableWelcome: true,
      logQR: false,
      autoClose: 0,
    })
      .then((client) => {
        this.client = client;
        console.log("WhatsApp initialized!");
      })
      .catch((err) => console.error("Error initializing Venom:", err));
  }

  async getQRCode(): Promise<string> {
    this.removeOldSession();

    return new Promise((resolve, reject) => {
      create(
        `whatsapp-session`,
        (qrCode) => {
          resolve(qrCode); // Return QR Code string
        },
        undefined,
        {
          headless: "new",
          folderNameToken: "tokens", // Persistent storage path
          mkdirFolderToken: "/usr/src/app/tokens", // Match the path created in the Dockerfile
          browserPathExecutable: "/usr/bin/chromium", // Pre-installed Chromium
          puppeteerOptions: {
            executablePath: "/usr/bin/chromium",
          },
          browserArgs: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
          ],
          disableSpins: true,
          disableWelcome: true,
          logQR: false,
          autoClose: 0,
        }
      )
        .then(() => console.log("QR Code captured"))
        .catch((err) => reject(err));
    });
  }

  async getConnectionStatus(): Promise<string> {
    if (!this.client) return "disconnected";

    const state = await this.client.getConnectionState();
    return state;
  }

  async getAllGroups(): Promise<any[]> {
    if (!this.client) throw new Error("Client not connected");
    const chats = await this.client.getAllChats();
    return chats.filter((chat) => (chat as Chat).isGroup);
  }

  async sendMessageToGroup(groupId: string, message: string): Promise<string> {
    if (!this.client) throw new Error("Client not connected");

    await this.client.sendText(groupId, message);
    return "Message sent!";
  }

  private removeOldSession(): void {
    const sessionPath = `${this.sessionFolder}`;
    if (existsSync(sessionPath)) {
      try {
        rmSync(sessionPath, { recursive: true, force: true }); // Delete the old session file
        console.log("Old session removed successfully.");
      } catch (err) {
        console.error("Error removing old session:", err);
      }
    } else {
      console.log("No existing session to remove.");
    }
  }
}

export default new WhatsAppService();
