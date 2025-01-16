import { createCallback } from "@cr0wdspace/common";
import { getDashboardDataController } from "admin-controllers/dashboard/getDashboardData.controller.js";
import { Router } from "express";

const adminDashboardRouter = Router();

adminDashboardRouter.get("/",createCallback(getDashboardDataController))

export default adminDashboardRouter