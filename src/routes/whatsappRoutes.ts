import { Router } from "express";
import { MethodInfo } from "../interfaces";
import { init } from "../utils/methods";
import isAuth from "../middleware/isAuth";
import * as WhatsappController from "../controllers/WhatsappController";

const whatsappRoutes = Router();

const whatsappMethods: { [key: string]: MethodInfo } = {
  "get-qr": {
    controllerFunction: WhatsappController.getQrCode,
    authFunction: isAuth,
    httpMethod: "get",
  },
  "get-status": {
    controllerFunction: WhatsappController.getStatus,
    authFunction: isAuth,
    httpMethod: "get",
  },
  "get-full-status": {
    controllerFunction: WhatsappController.getFullStatus,
    authFunction: isAuth,
    httpMethod: "get",
  },
  "get-groups": {
    controllerFunction: WhatsappController.getGroups,
    authFunction: isAuth,
    httpMethod: "get",
  },
  "save-group-id": {
    controllerFunction: WhatsappController.saveGroupId,
    authFunction: isAuth,
    httpMethod: "put",
  },
  "send-message": {
    controllerFunction: WhatsappController.sendMessage,
    authFunction: isAuth,
    httpMethod: "post",
  },
};

const mapedMethods = init(whatsappMethods);

// Map the route with method query
whatsappRoutes.route("/whatsapp/:method").all(mapedMethods);

export default whatsappRoutes;
