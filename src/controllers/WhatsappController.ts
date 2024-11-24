import { Request, Response } from "express";

import AppError from "../errors/AppError";
import controllerReturn from "../utils/successReturn";
import GetQrCodeService from "../services/WhatsappServices/GetQrCodeService";
import CheckConnectionStatusService from "../services/WhatsappServices/CheckConnectionStatusService";
import SaveGroupIdService from "../services/WhatsappServices/SaveGroupIdService";
import GetGroupsService from "../services/WhatsappServices/GetGroupsService";
import CheckFullConnectionStatusService from "../services/WhatsappServices/CheckFullConnectionStatusService";
import SendMessageWhatsapp from "../services/WhatsappServices/SendMessageWhatsapp";
import { disconnectWhatsAppAndRemoveAuthInfo } from "../utils/whatsapp";

export const getQrCode = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const qrCode = await GetQrCodeService();

  return controllerReturn(qrCode, req, res);
};

export const getFullStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const status = await CheckFullConnectionStatusService(Number(req.user.id));

  return controllerReturn(status, req, res);
};

export const getStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const status = await CheckConnectionStatusService();

  return controllerReturn(status, req, res);
};

export const getGroups = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const groups = await GetGroupsService();

  return controllerReturn(groups, req, res);
};

export const saveGroupId = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const { groupId } = body ?? (req.body as { groupId: string });

  if (!groupId) {
    throw new AppError("MISSING_DETAILS", 400);
  }

  const status = await SaveGroupIdService({
    groupId,
    userId: Number(req.user.id),
  });

  return controllerReturn(status, req, res);
};

export const sendMessage = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const { message } =
    body ??
    (req.body as {
      message?: string;
    });

  if (!message) {
    throw new AppError("Please Provide Message and Group Id", 400);
  }

  const status = await SendMessageWhatsapp(message, Number(req.user.id));

  return controllerReturn(status, req, res);
};

export const disconnectWhatsApp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const status = await disconnectWhatsAppAndRemoveAuthInfo();

  return controllerReturn(status, req, res);
};
