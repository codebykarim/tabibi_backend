import { Router } from "express";
import { MethodInfo } from "../interfaces";
import * as UserController from "../controllers/UserController";
import { init } from "../utils/methods";

const userRoutes = Router();

const userMethods: { [key: string]: MethodInfo } = {
  "check-login": {
    controllerFunction: UserController.checkLogin,
    httpMethod: "post",
  },
  login: {
    controllerFunction: UserController.login,
    httpMethod: "post",
  },
  register: {
    controllerFunction: UserController.register,
    httpMethod: "post",
  },
};

const mapedMethods = init(userMethods);

// Map the route with method query
userRoutes.route("/auth/users/:method").all(mapedMethods);

export default userRoutes;
