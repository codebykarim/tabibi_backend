import { Router } from "express";
import { MethodInfo } from "../interfaces";
import * as GPTController from "../controllers/GPTController";
import { init } from "../utils/methods";
import isAuth from "../middleware/isAuth";

const gptRoutes = Router();

const gptMethods: { [key: string]: MethodInfo } = {
  "get-gpt-response": {
    authFunction: isAuth,
    controllerFunction: GPTController.sendGPTResponse,
    httpMethod: "post",
  },
};

const mapedMethods = init(gptMethods);

// Map the route with method query
gptRoutes.route("/gpt/:method").all(mapedMethods);

export default gptRoutes;
