import prisma from "../../prisma";

interface Notification {
  // Define the Notification interface based on your Prisma schema
}

interface NotificationResponse {
  notifications: Notification[];
}

const GetMyNotificationsService = async (
  userId: number,
  onlyUnread?: boolean
): Promise<NotificationResponse> => {
  const notifications = await prisma.notification.findMany({
    where: {
      userId: userId,
      status: "SENT",
      ...(onlyUnread && { read: false }),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!notifications) {
    throw new Error("NOTIFICATIONS_NOT_FOUND");
  }

  return { notifications };
};

export default GetMyNotificationsService;
