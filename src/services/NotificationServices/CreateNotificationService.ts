import { NotificationType } from "@prisma/client";
import { Notification } from "@prisma/client";
import prisma from "../../prisma";
import AppError from "../../errors/AppError";
import { adminMessage } from "../../utils/firebase";

const CreateNotificationService = async (
  title: string,
  content: string,
  bodyContent: any,
  type: NotificationType,
  userId: number
): Promise<Notification> => {
  const notification = await prisma.notification
    .create({
      data: {
        title: title,
        body: bodyContent,
        content: JSON.stringify(content),
        type: type,
        userId: userId,
        status: "SENT",
      },
      include: {
        user: true,
      },
    })
    .then(async (data) => {
      if (data.user && data.user.fcmToken) {
        await adminMessage.send({
          notification: {
            title: title,
            body: bodyContent,
          },
          data: {
            content: JSON.stringify(content),
            type: type,
          },
          token: data.user.fcmToken,
        });
      }

      return data;
    });

  if (!notification) {
    throw new AppError("Notification not created");
  }

  return notification;
};

export default CreateNotificationService;
