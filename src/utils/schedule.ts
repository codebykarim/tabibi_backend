import prisma from "../prisma";
import schedule from "node-schedule";
import { adminMessage } from "./firebase";
import { NotificationType } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

const convertToCronFormat = (dateStr?: Date | null): string => {
  if (!dateStr) return "* * * * *";
  const date = new Date(dateStr);

  // Extract date components
  const minute = date.getMinutes();
  const hour = date.getHours();
  const day = date.getDate();
  const month = date.getMonth() + 1; // getMonth() is zero-based

  // Format into cron expression
  return `${minute} ${hour} ${day} ${month} *`;
};

export const scheduleNotification = (
  notificationId: number,
  message: {
    title: string;
    body: string;
    content?: JsonValue;
    type: NotificationType;
  },
  fcmToken?: string | null,
  dateStr?: Date | null
) => {
  const date = convertToCronFormat(dateStr);

  const job = schedule.scheduleJob(date, async () => {
    try {
      const { body, content, title, type } = message;

      if (!fcmToken) return;

      await adminMessage.send({
        notification: {
          title: title,
          body: body,
        },
        data: {
          content: JSON.stringify(content),
          type: type,
        },
        token: fcmToken,
      });

      console.log(`Notification sent to FCM token: ${fcmToken}`);

      // Mark as sent in the database
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: "SENT",
        },
      });

      job.cancel(); // Cancel the job after sending
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  });
};

export const initializeScheduledNotifications = async () => {
  const currentISODate = new Date().toISOString(); // Convert current date to ISO

  const pendingNotifications = await prisma.notification.findMany({
    where: {
      dateTime: { gt: currentISODate },
      status: "PENDING",
    },
    include: {
      user: true,
    },
  });

  pendingNotifications.forEach((notification) => {
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
  });
};
