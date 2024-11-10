import { Router } from "express";
import { MethodInfo } from "../interfaces";
import * as AdminController from "../controllers/AdminController";
import { init } from "../utils/methods";
import isAuth from "../middleware/isAuth";

const adminRoutes = Router();

const adminMethods: { [key: string]: MethodInfo } = {
  create: {
    controllerFunction: AdminController.createAdmin,
    httpMethod: "post",
  },
  me: {
    authFunction: isAuth,
    controllerFunction: AdminController.getMe,
    httpMethod: "get",
  },
  verify: {
    authFunction: isAuth,
    controllerFunction: AdminController.verifyUser,
    httpMethod: "post",
  },
};

const mapedMethods = init(adminMethods);

// Map the route with method query
adminRoutes.route("/auth/admins/:method").all(mapedMethods);

export default adminRoutes;
