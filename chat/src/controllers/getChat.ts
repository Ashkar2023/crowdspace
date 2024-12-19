import { AppError, BadRequestError, ResponseCreator } from "@crowdspace/common";
import { Request } from "express";
import { isValidObjectId, Types } from "mongoose";
import { chatRepoImp } from "repositories/index.repos.js";

const getChat = async (req: Request) => {
    const loggedInUser = req.headers["x-logged-in-user"] as string;
    const { chatId } = req.params;

    if (!isValidObjectId(chatId)) {
        throw new BadRequestError("Invalid chat identifier");
    }

    const chat = await chatRepoImp.findChat(
        new Types.ObjectId(chatId),
        new Types.ObjectId(loggedInUser)
    )

    if (!chat) {
        throw new BadRequestError("chat not found")
    }

    const response = new ResponseCreator();
    return response
        .setStatusCode(200)
        .setMessage(chat ? "chat found" : "chat not found")
        .setData({ chat })
        .get();
}

export default getChat