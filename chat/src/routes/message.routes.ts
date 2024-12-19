import getMessages from "@controllers/getMessages.controller.js";
import { createCallback } from "@crowdspace/common";
import { Router } from "express";

const messageRouter = Router();

// messageRouter.get("/:chat_id", createCallback(getMessages));

export default messageRouter;