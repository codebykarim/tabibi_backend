import { Chat } from "venom-bot";
import { whatsappClient } from "../../utils/whatsapp";

interface Response {
  chats: Chat[] | object[] | undefined;
}

const GetGroupsService = async (): Promise<Response> => {
  // Ensure that chats is typed as Chat[]
  const chats: Chat[] | object[] | undefined =
    await whatsappClient?.getAllChats();

  if (!chats || chats.length === 0) {
    return { chats: [] }; // Return empty array if there are no chats
  }

  // Filter out non-group chats (those with the isGroup property set to true)
  const groups = chats.filter((chat: Chat | object | undefined) => {
    if (!chat) {
      return false;
    }
    return (chat as Chat).groupMetadata !== null;
  });

  return {
    chats: groups, // Return only the group chats
  };
};

export default GetGroupsService;
