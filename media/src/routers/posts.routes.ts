import { createCallback } from "@cr0wdspace/common";
import { Router } from "express";
import multer from "multer"
import { postMediaUpload } from "../controllers/post-media/post-media-upload.controller.js";


export const postRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

postRouter.post("/posts", upload.array("media"), createCallback(postMediaUpload));