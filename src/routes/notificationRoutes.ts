import { Router } from "express";
import { MethodInfo } from "../interfaces";
import { init } from "../utils/methods";
import isAuth from "../middleware/isAuth";
import * as NotificationController from "../controllers/NotificationController";
const notificationRoutes = Router();

const notificationMethods: { [key: string]: MethodInfo } = {
  schedule: {
    authFunction: isAuth,
    controllerFunction: NotificationController.createScheduledNotification,
    httpMethod: "post",
  },
  "get-my-notifications": {
    authFunction: isAuth,
    controllerFunction: NotificationController.getMyNotifications,
    httpMethod: "get",
  },
  "read-one-notification": {
    authFunction: isAuth,
    controllerFunction: NotificationController.readOneNotification,
    httpMethod: "put",
  },
  "read-all-my-notifications": {
    authFunction: isAuth,
    controllerFunction: NotificationController.readAllMyNotifications,
    httpMethod: "put",
  },
  "create-notification": {
    authFunction: isAuth,
    controllerFunction: NotificationController.createNotification,
    httpMethod: "post",
  },
  "create-multiple-notifications": {
    authFunction: isAuth,
    controllerFunction: NotificationController.createMultipleNoficiations,
    httpMethod: "post",
  },
};

const mapedMethods = init(notificationMethods);

// Map the route with method query
notificationRoutes.route("/notification/:method").all(mapedMethods);

export default notificationRoutes;
