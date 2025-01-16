import { BadRequestError, ResponseCreator } from "@cr0wdspace/common";
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
    );

    if (!chat) {
        throw new BadRequestError("chat not found");
    }

    const endUserId = chat.participants.find(p => p.toString() !== loggedInUser)?.toString();

    if (!endUserId) {
        throw new BadRequestError("End user not found in chat participants");
    }

    const { body, message } = await (
        await fetch(process.env.USER_SERVICE + "/basic",
            {
                method: "POST",
                body: JSON.stringify({
                    user_ids: [endUserId]
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
    ).json();

    const chatWithProfile = {
        ...chat.toObject(),
        profile: body.profiles[0]
    };

    const response = new ResponseCreator();
    return response
        .setStatusCode(200)
        .setMessage("chat found")
        .setData({ chat: chatWithProfile })
        .get();
};

export default getChat;