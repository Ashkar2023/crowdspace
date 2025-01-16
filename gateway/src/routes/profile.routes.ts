import { createCallback } from "@cr0wdspace/common";
import { Request, Router } from "express";
import { getUserProfile } from "../controllers/profile.aggregator.js";



const profileRoutes = Router();

profileRoutes.get("/:username", createCallback(getUserProfile));

export default profileRoutes;