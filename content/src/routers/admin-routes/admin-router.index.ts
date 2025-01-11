import { Router } from "express"
import adminReportsRouter from "./admin-report.routes.js";

const adminRouter = Router();

adminRouter.use("/reports",adminReportsRouter);

export default adminRouter