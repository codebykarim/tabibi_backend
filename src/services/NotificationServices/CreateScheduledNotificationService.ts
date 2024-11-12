import { NotificationType } from "@prisma/client";
import { Notification } from "@prisma/client";
import prisma from "../../prisma";
import AppError from "../../errors/AppError";
import { scheduleNotification } from "../../utils/schedule";

const CreateScheduledNotificationService = async (
  title: string,
  content: string,
  bodyContent: any,
  type: NotificationType,
  userId: number,
  dateTime: Date
): Promise<Notification> => {
  const transformedData = new Date(dateTime);
  const notification = await prisma.notification.create({
    data: {
      title: title,
      body: bodyContent,
      content: JSON.stringify(content),
      type: type,
      userId: userId,
      dateTime: transformedData,
    },
    include: {
      user: true,
    },
  });

  if (!notification) {
    throw new AppError("Notification not created");
  }

  const message = {
    title: notification.title,
    body: notification.body,
    content: notification.content,
    type: notification.type,
  };

  scheduleNotification(
    notification.id,
    message,
    notification.user?.fcmToken,
    notification.dateTime
  );

  return notification;
};

export default CreateScheduledNotificationService;
