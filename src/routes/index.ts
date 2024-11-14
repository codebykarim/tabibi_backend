import { Router } from "express";
import userRoutes from "./userRoutes";
import adminRoutes from "./adminRoutes";
import villageRoutes from "./villageRoutes";
import notificationRoutes from "./notificationRoutes";
import gptRoutes from "./gptRoutes";

const routes = Router();

routes.use("/api", userRoutes);
routes.use("/api", adminRoutes);
routes.use("/api", villageRoutes);
routes.use("/api", notificationRoutes);
routes.use("/api", gptRoutes);

export default routes;
