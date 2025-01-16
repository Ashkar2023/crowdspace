import { getAllNotifications } from "@controllers/notification/getAllNotifications.controller.js";
import { createCallback } from "@cr0wdspace/common";
import { Router } from "express";

const notificationRouter = Router();

notificationRouter.get("/", createCallback(getAllNotifications));

export default notificationRouter