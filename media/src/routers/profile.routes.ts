import { avatarUpload } from "@controllers/profile/avatar-upload.controller.js";
import { createCallback } from "@crowdspace/common";
import { Router } from "express";
import multer from "multer";

export const profileRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

profileRouter.patch("/avatar", upload.single("avatar"), createCallback(avatarUpload));