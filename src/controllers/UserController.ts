import { Request, Response } from "express";

import AppError from "../errors/AppError";

import CheckLoginService from "../services/UserServices/CheckLoginService";
import controllerReturn from "../utils/successReturn";
import LoginService from "../services/UserServices/LoginService";
import RegisterService from "../services/UserServices/RegisterService";
import ChangePasswordService from "../services/UserServices/ChangePasswordService";
import GetUserService from "../services/UserServices/GetUserService";

export const checkLogin = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const { identitynumber } = body ?? (req.body as { identitynumber?: string });

  if (!identitynumber) {
    throw new AppError("Please Provide Identity Number", 400);
  }

  const { user } = await CheckLoginService(identitynumber);

  return controllerReturn(user, req, res);
};

export const login = async (req: Request, res: Response, body?: any) => {
  const { identitynumber, password } =
    body ?? (req.body as { identitynumber?: string; password?: string });

  if (!identitynumber || !password) {
    throw new AppError("Please Provide Identity Number and Password", 400);
  }

  const data = await LoginService(identitynumber, password);

  return controllerReturn({ ...data }, req, res);
};

export const register = async (req: Request, res: Response, body?: any) => {
  const { identitynumber, name, phone, village } =
    body ??
    (req.body as {
      identitynumber?: string;
      name?: string;
      phone?: string;
      village?: string;
    });

  if (!identitynumber || !name || !phone || !village) {
    throw new AppError("Plese Provide All the Details", 400);
  }

  const { user } = await RegisterService(identitynumber, name, phone, village);

  return controllerReturn({ user }, req, res);
};

export const changePasswordFirstTime = async (
  req: Request,
  res: Response,
  body?: any
) => {
  const { identitynumber, newPassword } =
    body ??
    (req.body as {
      identitynumber?: string;
      oldPassword?: string;
      newPassword?: string;
    });

  if (!identitynumber || !newPassword) {
    throw new AppError("Plese Provide All the Details", 400);
  }

  const { user, token } = await ChangePasswordService(
    identitynumber,
    undefined,
    newPassword
  );

  return controllerReturn({ user, token }, req, res);
};

export const getMe = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const admin = await GetUserService(Number(req.user.id));

  return controllerReturn(admin, req, res);
};
