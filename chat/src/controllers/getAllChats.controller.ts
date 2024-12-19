import { ResponseCreator } from "@crowdspace/common";
import { Request } from "express";
import { Types } from "mongoose";
import { chatRepoImp } from "repositories/index.repos.js";

export const getAllChats = async (req: Request) => {
    const loggedInUser = req.headers["x-logged-in-user"] as string;

    const chats = await chatRepoImp.findAllChats(new Types.ObjectId(loggedInUser))

    const response = new ResponseCreator();
    return response
        .setStatusCode(200)
        .setMessage("chats fetched")
        .setData({ count: chats.length, chats })
        .get();
}
