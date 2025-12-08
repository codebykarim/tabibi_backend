import { Request, Response } from "express";

import AppError from "../errors/AppError";
import controllerReturn from "../utils/successReturn";
import { NotificationType } from "@prisma/client";
import CreateScheduledNotificationService from "../services/NotificationServices/CreateScheduledNotificationService";
import GetMyNotificationsService from "../services/NotificationServices/GetMyNotificationsService";
import ReadOneNotification from "../services/NotificationServices/ReadOneNotification";
import ReadAllMyNotifications from "../services/NotificationServices/ReadAllMyNotifications";
import CreateNotificationService from "../services/NotificationServices/CreateNotificationService";
import CreateMultipleNotificationService from "../services/NotificationServices/CreateMultipleNotificationService";

export const createNotification = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const { title, content, bodyContent, type, userId } =
    body ??
    (req.body as {
      title?: string;
      content?: string;
      bodyContent?: any;
      type?: string;
      userId?: number;
    });

  if (!title || !content || !bodyContent || !type || !userId) {
    throw new AppError(
      "Please Provide Title, Content, Body, Type, UserId and AdminId",
      400
    );
  }

  const notification = await CreateNotificationService(
    title,
    content,
    bodyContent,
    type,
    userId
  );

  return controllerReturn(notification, req, res);
};

export const createMultipleNoficiations = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const { title, content, bodyContent, type, userIds } =
    body ??
    (req.body as {
      title?: string;
      content?: string;
      bodyContent?: any;
      type?: string;
      userId?: number[];
    });

  if (!title || !content || !bodyContent || !type || !userIds) {
    throw new AppError(
      "Please Provide Title, Content, Body, Type, UserId and AdminId",
      400
    );
  }

  const notification = await CreateMultipleNotificationService(
    title,
    content,
    bodyContent,
    type,
    userIds
  );

  return controllerReturn(notification, req, res);
};

export const createScheduledNotification = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const { title, content, bodyContent, type, userId, dateTime } =
    body ??
    (req.body as {
      title?: string;
      content?: string;
      bodyContent?: any;
      type?: NotificationType;
      userId?: number;
      dateTime?: Date;
    });

  if (!title || !content || !bodyContent || !type || !userId || !dateTime) {
    throw new AppError(
      "Please Provide Title, Content, Body, Type, UserId, AdminId and AdminId",
      400
    );
  }

  const notification = await CreateScheduledNotificationService(
    title,
    content,
    bodyContent,
    type,
    userId,
    dateTime
  );

  return controllerReturn(notification, req, res);
};

export const getMyNotifications = async (
  req: Request,
  res: Response,
  body?: any
) => {
  const { onlyUnread, pageNumber } =
    body ??
    (req.query as { onlyUnread?: boolean; pageNumber?: string | number });

  const notifications = await GetMyNotificationsService(
    Number(req.user.id),
    onlyUnread,
    pageNumber
  );

  return controllerReturn(notifications, req, res);
};

export const readOneNotification = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const { id } = body ?? (req.body as { id: number });

  if (!id) {
    throw new AppError("Please Provide Id", 400);
  }

  const notification = await ReadOneNotification(Number(id));

  return controllerReturn(notification, req, res);
};

export const readAllMyNotifications = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const notifications = await ReadAllMyNotifications(Number(req.user.id));

  return controllerReturn(notifications, req, res);
};
