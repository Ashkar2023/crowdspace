import { Router } from "express"
import adminReportsRouter from "./admin-report.routes.js";
import adminDashboardRouter from "./admin-dashboard.routes.js";

const adminRouter = Router();

adminRouter.use("/reports",adminReportsRouter);
adminRouter.use("/dashboard",adminDashboardRouter);

export default adminRouter