import { ResponseCreator } from "@crowdspace/common";
import { Request } from "express";
import { isValidObjectId, Types } from "mongoose";
import { chatRepoImp } from "repositories/index.repos.js";

export const getChats = async (req: Request) => {
    const loggedInUser = req.headers["x-logged-in-user"] as string;

    const chats = await chatRepoImp.getAllChats(new Types.ObjectId(loggedInUser))

    const response = new ResponseCreator();
    return response
        .setStatusCode(200)
        .setMessage("chats fetched")
        .setData({ count: chats.length, chats })
        .get();
}
