import AppError from "../../errors/AppError";
import prisma from "../../prisma";

interface Response {
  success: boolean;
}

const SaveGroupIdService = async ({
  groupId,
  userId,
}: {
  groupId: string;
  userId: number;
}): Promise<Response> => {
  const admin = await prisma.admin.update({
    where: {
      id: userId,
    },
    data: {
      whatsappGroupId: groupId,
    },
  });

  if (!admin) {
    throw new AppError("Something went wrong");
  }

  return { success: true };
};

export default SaveGroupIdService;
