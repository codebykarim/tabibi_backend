import { Request, Response } from "express";
import AppError from "../errors/AppError";
import controllerReturn from "../utils/successReturn";
import CreateForm from "../services/FormServices/createFormService";
import { FormType } from "@prisma/client";

export const createAskDoctorForm = async (
  req: Request,
  res: Response,
  body?: any
) => {
  const { howToHelp, media } =
    body ?? (req.body as { howToHelp?: string; media?: string[] });

  if (!howToHelp) {
    throw new AppError("Please Provide Input", 400);
  }

  const form = await CreateForm({
    type: FormType.ASK_DOCTOR,
    formData: {
      howToHelp,
      media: media.join(","),
      userId: Number(req.user?.id),
    },
  });

  return controllerReturn(form, req, res);
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
    media,
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
      media?: string[];
    });

  if (!symptoms) {
    throw new AppError("Please Provide Input", 400);
  }
  const form = await CreateForm({
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
      media,
      userId: Number(req.user?.id),
    },
  });
  return controllerReturn(form, req, res);
};

export const createPrescriptionForm = async (
  req: Request,
  res: Response,
  body?: any
) => {
  const { medicine, medicineReason, medicineRenew, media } =
    body ??
    (req.body as {
      medicine?: string;
      medicineReason?: string;
      medicineRenew?: boolean;
      media?: string[];
    });

  if (!medicine) {
    throw new AppError("Please Provide Input", 400);
  }

  const form = await CreateForm({
    type: FormType.ASK_DOCTOR,
    formData: {
      medicine,
      medicineReason,
      medicineRenew,
      media: media.join(","),
      userId: Number(req.user?.id),
    },
  });

  return controllerReturn(form, req, res);
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

  const form = await CreateForm({
    type: FormType.ASK_DOCTOR,
    formData: {
      requiredPapers,
      notes,
      userId: Number(req.user?.id),
    },
  });

  return controllerReturn(form, req, res);
};
