import { getAllChats } from "@controllers/getAllChats.controller.js";
import getChat from "@controllers/getChat.controller.js";
import getChatByUser from "@controllers/getChatByUser.controller.js";
import getMessages from "@controllers/getMessages.controller.js";
import { createCallback } from "@cr0wdspace/common";
import { Router } from "express";

const ChatRouter = Router();

ChatRouter.get("/", createCallback(getAllChats)); // get a users chats, id is passed through req headers

ChatRouter.get("/search/:endUserId", createCallback(getChatByUser))

ChatRouter.get("/:chatId/messages",createCallback(getMessages))

ChatRouter.get("/:chatId",createCallback(getChat))

export default ChatRouter;