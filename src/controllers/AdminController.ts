import { Request, Response } from "express";

import AppError from "../errors/AppError";
import controllerReturn from "../utils/successReturn";
import { AdminRole } from "@prisma/client";
import CreateAdminService from "../services/AdminServices/CreateAdminService";
import GetAdminService from "../services/AdminServices/GetAdminService";
import VerifyUserService from "../services/AdminServices/VerifyUserService";

type Adminfilter = {
  email?: string;
  name?: string;
  password?: string;
  role?: string;
  phone?: string;
  address?: string;
  online?: string;
  fcmToken?: string;
  profilePicture?: string;
  searchParam: string;
  permissions: Permissions[];
  pageNumber: string;
};

export const createAdmin = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const {
    email,
    password,
    name,
    role = AdminRole.DOCTOR,
  } = body ?? (req.body as Adminfilter);

  if (!email || !password || !name || !role) {
    throw new AppError("MISSING_DETAILS", 400);
  }

  const emailRegExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const passwordLength = 6;
  const nameLength = 2;

  if (
    !emailRegExp.test(email) ||
    password.length < passwordLength ||
    name.length < nameLength
  ) {
    throw new AppError("INCORRECT_DETAILS", 400);
  }

  const admin = await CreateAdminService({
    email,
    password,
    name,
    role,
  });

  return controllerReturn(admin, req, res);
};

export const getMe = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const { id } = body ?? (req.body as { id?: number });

  if (!id) {
    throw new AppError("MISSING_DETAILS", 400);
  }

  const admin = await GetAdminService(id);

  return controllerReturn(admin, req, res);
};

export const verifyUser = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const { id } = body ?? (req.body as { id?: number });

  if (!id) {
    throw new AppError("MISSING_DETAILS", 400);
  }

  const admin = await VerifyUserService(id);

  return controllerReturn(admin, req, res);
};
