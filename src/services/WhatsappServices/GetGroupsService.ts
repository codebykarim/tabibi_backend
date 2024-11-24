import WhatsAppService from "../../utils/whatsapp";

interface Response {
  chats: any;
}

const GetGroupsService = async (): Promise<Response> => {
  const chats = await WhatsAppService.getAllGroups();

  return {
    chats,
  };
};

export default GetGroupsService;
