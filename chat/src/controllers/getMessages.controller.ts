import { BadRequestError, ResponseCreator } from "@cr0wdspace/common";
import { Request } from "express";
import { isValidObjectId, Types } from "mongoose";
import { messageRepoImp } from "repositories/index.repos.js";

const getMessages = async (req: Request) => {
    const { chatId } = req.params;

    if (!isValidObjectId(chatId)) {
        throw new BadRequestError('invalid chat identifier');
    }

    const messages = await messageRepoImp.findMessages(new Types.ObjectId(chatId));

    const response = new ResponseCreator();
    return response
        .setStatusCode(200)
        .setMessage(messages.length > 0 ? "messages fetched" : "no messages found")
        .setData({ messages, count: messages.length })
        .get();
}

export default getMessages;