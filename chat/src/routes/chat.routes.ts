import { getChats } from "@controllers/getChats.controller.js";
import { createCallback } from "@crowdspace/common";
import { Router } from "express";

const ChatRouter = Router();

ChatRouter.get("/", createCallback(getChats));

export default ChatRouter;