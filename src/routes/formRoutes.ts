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
  "get-forms": {
    authFunction: isAuth,
    controllerFunction: FormController.getForms,
    httpMethod: "get",
  },
  "get-my-forms": {
    authFunction: isAuth,
    controllerFunction: FormController.getMyForms,
    httpMethod: "get",
  },
};

const mapedMethods = init(formMethods);

// Map the route with method query
formRoutes.route("/forms/:method").all(mapedMethods);

export default formRoutes;
