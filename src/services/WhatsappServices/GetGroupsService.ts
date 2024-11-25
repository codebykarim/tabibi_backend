import { fetchGroups } from "../../utils/whatsapp";

interface Response {
  chats: any;
}

const GetGroupsService = async (adminId: number): Promise<Response> => {
  const chats = await fetchGroups(adminId);
  console.log("chats", chats);

  return {
    chats,
  };
};

export default GetGroupsService;
