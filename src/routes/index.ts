import { Router } from "express";
import userRoutes from "./userRoutes";
import adminRoutes from "./adminRoutes";
import villageRoutes from "./villageRoutes";
import notificationRoutes from "./notificationRoutes";
import gptRoutes from "./gptRoutes";
import formRoutes from "./formRoutes";

const routes = Router();

routes.use("/api", userRoutes);
routes.use("/api", adminRoutes);
routes.use("/api", villageRoutes);
routes.use("/api", notificationRoutes);
routes.use("/api", gptRoutes);
routes.use("/api", formRoutes);

export default routes;
