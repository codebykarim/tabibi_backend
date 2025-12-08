import { NotificationType } from "@prisma/client";
import { Notification } from "@prisma/client";
import prisma from "../../prisma";
import AppError from "../../errors/AppError";
import { adminMessage } from "../../utils/firebase";

interface Response {
  success: boolean;
}

const CreateMultipleNotificationService = async (
  title: string,
  content: string,
  bodyContent: any,
  type: NotificationType,
  userIds: number[]
): Promise<Response> => {
  // Create notifications for each user
  const notifications = await prisma.notification.createMany({
    data: userIds.map((userId) => ({
      title: title,
      body: bodyContent,
      content: JSON.stringify(content),
      type: type,
      userId: userId,
      status: "SENT",
    })),
  });

  if (notifications.count === 0) {
    throw new AppError("Notification not created");
  }

  // Fetch fcmTokens for all users
  const users = await prisma.user.findMany({
    where: {
      id: { in: userIds },
    },
    select: {
      fcmToken: true,
    },
  });

  // Send notifications via FCM to all users with fcmToken
  for (const user of users) {
    if (user.fcmToken) {
      await adminMessage.send({
        notification: {
          title: title,
          body: bodyContent,
        },
        data: {
          content: JSON.stringify(content),
          type: type,
        },
        token: user.fcmToken,
      });
    }
  }

  return {
    success: true,
  };
};

export default CreateMultipleNotificationService;
