import { Router } from "express";
import userRoutes from "./userRoutes";
import adminRoutes from "./adminRoutes";
import villageRoutes from "./villageRoutes";

const routes = Router();

routes.use("/api", userRoutes);
routes.use("/api", adminRoutes);
routes.use("/api", villageRoutes);

export default routes;
