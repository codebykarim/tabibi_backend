import { Request, Response } from "express";

import AppError from "../errors/AppError";

import CheckLoginService from "../services/UserServices/CheckLoginService";
import controllerReturn from "../utils/successReturn";
import LoginService from "../services/UserServices/LoginService";
import RegisterService from "../services/UserServices/RegisterService";
import ChangePasswordService from "../services/UserServices/ChangePasswordService";
import GetUserService from "../services/UserServices/GetUserService";
import UpdateUserService from "../services/UserServices/UpdateUserService";
import CreateUserService from "../services/UserServices/CreateUserService";
import { Gender } from "@prisma/client";
import DeleteUserService from "../services/UserServices/DeleteUserService";
import GetUsersService from "../services/UserServices/GetUsersService";

//  Mobile app
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

export const addFcmToken = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const { fcmToken } =
    body ??
    (req.body as {
      fcmToken?: string;
    });
  const user = await UpdateUserService({
    data: {
      id: Number(req.user.id),
      fcmToken,
    },
  });

  return controllerReturn(user, req, res);
};

// Dashboard
export const createUser = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const { identitynumber, name, phone, villageId, gender } =
    body ??
    (req.body as {
      identitynumber?: string;
      name?: string;
      phone?: string;
      villageId?: string;
      gender?: Gender;
    });

  if (!identitynumber || !name || !villageId || !gender) {
    throw new AppError("MISSING_DETAILS");
  }

  const user = await CreateUserService({
    identitynumber,
    name,
    phone,
    villageId: Number(villageId),
    gender: gender,
  });

  return controllerReturn(user, req, res);
};

export const updateUser = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const { id, name, identitynumber, phone, villageId, gender, isverified } =
    body ??
    (req.body as {
      id?: number;
      identitynumber?: string;
      name?: string;
      phone?: string;
      villageId?: string;
      gender?: Gender;
    });

  const user = await UpdateUserService({
    data: {
      id: Number(id),
      name,
      identitynumber,
      phone,
      villageId: villageId && Number(villageId),
      gender: gender,
      isverified: isverified,
    },
  });

  return controllerReturn(user, req, res);
};

export const deleteUser = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const { id } =
    body ??
    (req.body as {
      id?: number;
    });

  if (!id) {
    throw new AppError("MISSING_DETAILS");
  }

  const user = await DeleteUserService(Number(id));

  return controllerReturn(user, req, res);
};

export const getUser = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const { id } =
    body ??
    (req.query as {
      id?: number;
    });

  if (!id) {
    throw new AppError("MISSING_DETAILS");
  }

  const user = await GetUserService(Number(id));

  return controllerReturn(user, req, res);
};

export const getUsers = async (req: Request, res: Response) => {
  const users = await GetUsersService();

  return controllerReturn(users, req, res);
};
