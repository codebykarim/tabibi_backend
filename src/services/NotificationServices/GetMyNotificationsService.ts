import { Notification } from "@prisma/client";
import prisma from "../../prisma";
import AppError from "../../errors/AppError";

interface NotificationResponse {
  notifications: Notification[];
}

const GetMyNotificationsService = async (
  userId: number,
  onlyUnread?: boolean,
  pageNumber: string | number = "1"
): Promise<NotificationResponse> => {
  const limit = 10;
  const offset = limit * (+pageNumber - 1);

  const notifications = await prisma.notification.findMany({
    where: {
      userId: userId,
      status: "SENT",
      ...(onlyUnread && { read: false }),
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: offset,
    take: limit,
  });

  if (!notifications) {
    throw new AppError("NOTIFICATIONS_NOT_FOUND");
  }

  return { notifications };
};

export default GetMyNotificationsService;
