import { Router } from "express";
import { MethodInfo } from "../interfaces";
import * as VillageController from "../controllers/VillageController";
import { init } from "../utils/methods";
import isAuth from "../middleware/isAuth";

const villageRoutes = Router();

const villageMethods: { [key: string]: MethodInfo } = {
  create: {
    controllerFunction: VillageController.createVillage,
    httpMethod: "post",
    authFunction: isAuth,
  },
  getAll: {
    controllerFunction: VillageController.getAllVillages,
    httpMethod: "get",
  },
  get: {
    controllerFunction: VillageController.getVillage,
    httpMethod: "get",
    authFunction: isAuth,
  },
  update: {
    controllerFunction: VillageController.updateVillage,
    httpMethod: "put",
    authFunction: isAuth,
  },
  delete: {
    controllerFunction: VillageController.deleteVillage,
    httpMethod: "delete",
    authFunction: isAuth,
  },
};

const mapedMethods = init(villageMethods);

// Map the route with method query
villageRoutes.route("/village/:method").all(mapedMethods);

export default villageRoutes;
