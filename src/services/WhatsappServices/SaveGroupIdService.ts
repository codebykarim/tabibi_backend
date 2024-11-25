import AppError from "../../errors/AppError";
import prisma from "../../prisma";

interface Response {
  success: boolean;
}

const SaveGroupIdService = async ({
  groupId,
  adminId,
}: {
  groupId: string;
  adminId: number;
}): Promise<Response> => {
  const admin = await prisma.admin.update({
    where: {
      id: adminId,
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
