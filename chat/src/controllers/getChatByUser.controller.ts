import { AppError, BadRequestError, ResponseCreator } from "@crowdspace/common";
import { Request } from "express";
import { isValidObjectId, Types } from "mongoose";
import { chatRepoImp } from "repositories/index.repos.js";

const getChat = async (req: Request) => {
    const loggedInUser = req.headers["x-logged-in-user"] as string;
    const { endUserId } = req.params;

    if(!isValidObjectId(endUserId)){
        throw new BadRequestError("Invalid endUserId");
    }

    const userObjectId = new Types.ObjectId(loggedInUser);
    const endUserObjectId = new Types.ObjectId(endUserId);

    const chat = await chatRepoImp.findChatByParticipants(
        userObjectId,
        endUserObjectId
    );

    let newChat = null;

    if (!chat) {
        newChat = await chatRepoImp.createChat(userObjectId, endUserObjectId);
    }

    const response = new ResponseCreator();
    return response
        .setStatusCode(200)
        .setMessage(chat ? "fetch successfull" : "chat created")
        .setData({ chat: chat ?? newChat })
        .get();
}

export default getChat