import { createCallback } from "@cr0wdspace/common";
import { getReports } from "admin-controllers/report/getReports.controller.js";
import { updateReportStatus } from "admin-controllers/report/updateReportStatus.js";
import { Router } from "express";

const adminReportsRouter = Router();

adminReportsRouter.get("/",createCallback(getReports));

adminReportsRouter.patch("/:report_id/status",createCallback(updateReportStatus));

export default adminReportsRouter;