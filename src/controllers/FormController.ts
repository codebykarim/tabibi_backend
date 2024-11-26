import { Request, Response } from "express";
import AppError from "../errors/AppError";
import controllerReturn from "../utils/successReturn";
import CreateForm from "../services/FormServices/createFormService";
import { FormType } from "@prisma/client";

import { uploadImages } from "../utils/uploadImages";
import GetFormsService from "../services/FormServices/GetFormsService";
import GetMyFormsService from "../services/FormServices/GetMyFormsService";
import DeleteFormService from "../services/FormServices/DeleteFormService";

export const createAskDoctorForm = async (
  req: Request,
  res: Response,
  body?: any
) => {
  const { howToHelp } = body ?? (req.body as { howToHelp?: string });

  if (!howToHelp) {
    throw new AppError("Please Provide Input", 400);
  }

  let urls;

  // Process uploaded files
  if (req.files) {
    const media = (req.files as Express.Multer.File[])?.map((file) => {
      if (file.size > 1048576) {
        throw new AppError("File size should be less than 1MB", 400);
      }
      return {
        fileName: `${Date.now()}-${file.originalname}`,
        fileBuffer: file.buffer,
        mimeType: file.mimetype,
      };
    });

    urls = (await uploadImages(media)).filter((url) => url !== null);
  }

  await CreateForm({
    type: FormType.ASK_DOCTOR,
    formData: {
      howToHelp,
      media: urls,
      userId: Number(req.user?.id),
    },
  });

  return controllerReturn({ success: true }, req, res);
};

export const createMedicalCasesForm = async (
  req: Request,
  res: Response,
  body?: any
) => {
  const {
    symptoms,
    startOfSymptoms,
    intensityOfSymptoms,
    otherSymptoms,
    currentTemperature,
    currentHeartBeat,
    currentOxygen,
    currentBloodPressure,
  } =
    body ??
    (req.body as {
      symptoms?: string;
      startOfSymptoms?: string;
      intensityOfSymptoms?: string;
      otherSymptoms?: string;
      currentTemperature?: string;
      currentHeartBeat?: string;
      currentOxygen?: string;
      currentBloodPressure?: string;
    });

  if (!symptoms) {
    throw new AppError("Please Provide Input", 400);
  }

  let urls;

  // Process uploaded files
  if (req.files) {
    const media = (req.files as Express.Multer.File[])?.map((file) => {
      if (file.size > 1048576) {
        throw new AppError("File size should be less than 1MB", 400);
      }
      return {
        fileName: `${Date.now()}-${file.originalname}`,
        fileBuffer: file.buffer,
        mimeType: file.mimetype,
      };
    });

    urls = (await uploadImages(media)).filter((url) => url !== null);
  }

  await CreateForm({
    type: FormType.MEDICAL_CASES,
    formData: {
      symptoms,
      startOfSymptoms,
      intensityOfSymptoms,
      otherSymptoms,
      currentTemperature,
      currentHeartBeat,
      currentOxygen,
      currentBloodPressure,
      media: urls,
      userId: Number(req.user?.id),
    },
  });

  return controllerReturn({ success: true }, req, res);
};

export const createPrescriptionForm = async (
  req: Request,
  res: Response,
  body?: any
) => {
  const { medicine, medicineReason, medicineRenew } =
    body ??
    (req.body as {
      medicine?: string;
      medicineReason?: string;
      medicineRenew?: boolean;
    });

  if (!medicine) {
    throw new AppError("Please Provide Input", 400);
  }

  let urls;

  // Process uploaded files
  if (req.files) {
    const media = (req.files as Express.Multer.File[])?.map((file) => {
      if (file.size > 1048576) {
        throw new AppError("File size should be less than 1MB", 400);
      }
      return {
        fileName: `${Date.now()}-${file.originalname}`,
        fileBuffer: file.buffer,
        mimeType: file.mimetype,
      };
    });

    urls = (await uploadImages(media)).filter((url) => url !== null);
  }

  await CreateForm({
    type: FormType.PRESCRIPTION,
    formData: {
      medicine,
      medicineReason,
      medicineRenew: medicineRenew == "true",
      media: urls,
      userId: Number(req.user?.id),
    },
  });

  return controllerReturn({ success: true }, req, res);
};

export const createPapersForm = async (
  req: Request,
  res: Response,
  body?: any
) => {
  const { requiredPapers, notes } =
    body ??
    (req.body as {
      requiredPapers?: string;
      notes?: string;
    });

  if (!requiredPapers) {
    throw new AppError("Please Provide Input", 400);
  }

  await CreateForm({
    type: FormType.PAPERS,
    formData: {
      requiredPapers,
      notes,
      userId: Number(req.user?.id),
    },
  });

  return controllerReturn({ success: true }, req, res);
};

export const getForms = async (req: Request, res: Response, body?: any) => {
  const forms = await GetFormsService();

  return controllerReturn(forms, req, res);
};

export const getMyForms = async (req: Request, res: Response, body?: any) => {
  const { id } =
    body ??
    (req.query as {
      id?: string;
    });

  const forms = await GetMyFormsService(Number(id));

  return controllerReturn(forms, req, res);
};

export const deleteForm = async (req: Request, res: Response, body?: any) => {
  const { id } =
    body ??
    (req.body as {
      id?: string;
    });

  if (!id) {
    throw new AppError("Please Provide Id", 400);
  }

  const form = await DeleteFormService(Number(id));

  return controllerReturn(form, req, res);
};
