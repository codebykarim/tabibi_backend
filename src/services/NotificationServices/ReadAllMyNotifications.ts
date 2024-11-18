import { Notification } from "@prisma/client";
import prisma from "../../prisma";
import AppError from "../../errors/AppError";

interface Response {
  success: boolean;
}

const ReadAllMyNotifications = async (userId: number): Promise<Response> => {
  const notifications = await prisma.notification.updateMany({
    where: {
      userId: userId,
    },
    data: {
      read: true,
    },
  });

  if (!notifications) {
    throw new AppError("NOTIFICATIONS_NOT_FOUND");
  }

  return {
    success: true,
  };
};

export default ReadAllMyNotifications;
