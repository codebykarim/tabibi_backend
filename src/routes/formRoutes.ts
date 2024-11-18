import { Router } from "express";
import { MethodInfo } from "../interfaces";
import * as FormController from "../controllers/FormController";
import { init } from "../utils/methods";
import isAuth from "../middleware/isAuth";

const formRoutes = Router();

const formMethods: { [key: string]: MethodInfo } = {
  "ask-doctor-form": {
    authFunction: isAuth,
    controllerFunction: FormController.createAskDoctorForm,
    httpMethod: "post",
  },
  "medical-cases-form": {
    authFunction: isAuth,
    controllerFunction: FormController.createMedicalCasesForm,
    httpMethod: "post",
  },
  "prescription-form": {
    authFunction: isAuth,
    controllerFunction: FormController.createPrescriptionForm,
    httpMethod: "post",
  },
  "papers-form": {
    authFunction: isAuth,
    controllerFunction: FormController.createPapersForm,
    httpMethod: "post",
  },
};

const mapedMethods = init(formMethods);

// Map the route with method query
formRoutes.route("/forms/:method").all(mapedMethods);

export default formRoutes;
