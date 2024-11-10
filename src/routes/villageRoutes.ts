import { Router } from "express";
import { MethodInfo } from "../interfaces";
import * as VillageController from "../controllers/VillageController";
import { init } from "../utils/methods";

const villageRoutes = Router();

const villageMethods: { [key: string]: MethodInfo } = {
  create: {
    controllerFunction: VillageController.createVillage,
    httpMethod: "post",
  },
  getAll: {
    controllerFunction: VillageController.getAllVillages,
    httpMethod: "get",
  },
  get: {
    controllerFunction: VillageController.getVillage,
    httpMethod: "get",
  },
  update: {
    controllerFunction: VillageController.updateVillage,
    httpMethod: "post",
  },
  delete: {
    controllerFunction: VillageController.deleteVillage,
    httpMethod: "delete",
  },
};

const mapedMethods = init(villageMethods);

// Map the route with method query
villageRoutes.route("/village/:method").all(mapedMethods);

export default villageRoutes;
