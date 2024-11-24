import { create, Whatsapp, Chat } from "venom-bot";

class WhatsAppService {
  private client: Whatsapp | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    create(`whatsapp-session`, undefined, undefined, {
      headless: "new",
      folderNameToken: "tokens", // Persistent storage path
      mkdirFolderToken: "/data",
      browserPathExecutable: "/usr/bin/google-chrome-stable",
      puppeteerOptions: {
        executablePath: "/usr/bin/google-chrome-stable",
      },
      browserArgs: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
      disableSpins: true,
      disableWelcome: true,
      autoClose: 0,
    })
      .then((client) => {
        this.client = client;
        console.log("WhatsApp initialized!");
      })
      .catch((err) => console.error("Error initializing Venom:", err));
  }

  async getQRCode(): Promise<string> {
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
          mkdirFolderToken: "/data",
          browserPathExecutable: "/usr/bin/google-chrome-stable",
          puppeteerOptions: {
            executablePath: "/usr/bin/google-chrome-stable",
          },
          browserArgs: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
          ],
          disableSpins: true,
          disableWelcome: true,
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
}

export default new WhatsAppService();
