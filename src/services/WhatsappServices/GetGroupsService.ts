import { fetchGroups } from "../../utils/whatsapp";

interface Response {
  chats: any;
}

const GetGroupsService = async (): Promise<Response> => {
  const chats = await fetchGroups();
  console.log("chats", chats);

  return {
    chats,
  };
};

export default GetGroupsService;
