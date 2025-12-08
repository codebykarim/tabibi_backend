import { Notification } from "@prisma/client";
import prisma from "../../prisma";
import AppError from "../../errors/AppError";

interface Response {
  success: boolean;
}

const ReadOneNotification = async (id: number): Promise<Response> => {
  const notification = await prisma.notification.update({
    where: {
      id: id,
    },
    data: {
      read: true,
    },
  });

  if (!notification) {
    throw new AppError("NOTIFICATION_NOT_FOUND");
  }

  return {
    success: true,
  };
};

export default ReadOneNotification;
