import { Request, Response } from "express";

import AppError from "../errors/AppError";
import controllerReturn from "../utils/successReturn";
import CreateVillageService from "../services/VillageServices/CreateVillageService";
import GetAllVillagesService from "../services/VillageServices/GetAllVillagesService";
import UpdateVillageService from "../services/VillageServices/UpdateVillageService";
import GetVillageService from "../services/VillageServices/GetVillageService";
import DeleteVillageService from "../services/VillageServices/DeleteVillageService";

export const createVillage = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const { name, location } =
    body ?? (req.body as { name?: string; location?: string });

  if (!name || !location) {
    throw new AppError("Please Provide Name and Location", 400);
  }

  const village = await CreateVillageService({ name, location });

  return controllerReturn(village, req, res);
};

export const getAllVillages = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const villages = await GetAllVillagesService();

  return controllerReturn(villages, req, res);
};

export const getVillage = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const { id } = body ?? (req.body as { id?: number });

  if (!id) {
    throw new AppError("Please Provide Id", 400);
  }

  const village = await GetVillageService(id);

  return controllerReturn(village, req, res);
};

export const updateVillage = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const { id, name, location } =
    body ?? (req.body as { id?: number; name?: string; location?: string });

  if (!id || !name || !location) {
    throw new AppError("Please Provide Id, Name and Location", 400);
  }

  const village = await UpdateVillageService(id, name, location);

  return controllerReturn(village, req, res);
};

export const deleteVillage = async (
  req: Request,
  res: Response,
  body?: any
): Promise<Response> => {
  const { id } = body ?? (req.body as { id?: number });

  if (!id) {
    throw new AppError("Please Provide Id", 400);
  }

  const village = await DeleteVillageService(id);

  return controllerReturn(village, req, res);
};
