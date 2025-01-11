import { createUserBasicDict, IBasicUser, injectProfiles, ResponseCreator } from "@crowdspace/common";
import { Request } from "express";
import { Types } from "mongoose";
import { chatRepoImp } from "repositories/index.repos.js";
import { IChat } from "~types/chat.type.js";

export const getAllChats = async (req: Request) => {
    const loggedInUser = req.headers["x-logged-in-user"] as string;

    const chats = await chatRepoImp.findAllChats(new Types.ObjectId(loggedInUser))

    const userIdSet = new Set<string>();

    chats.forEach(chat => {
        const endUserId = chat.participants.filter(p => {
            return p.toString() !== loggedInUser
        })

        userIdSet.add(endUserId[0].toString());
    })

    const { body, message } = await (
        await fetch(process.env.USER_SERVICE + "/basic",
            {
                method: "POST",
                body: JSON.stringify({
                    user_ids: Array.from(userIdSet)
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
    ).json();

    const profileDict = createUserBasicDict(body.profiles);

    const chatWithProfiles: (IChat & { profile: IBasicUser })[] = chats.map((chat) => {

        const endUserId = chat.participants.filter(p => {
            return p.toString() !== loggedInUser
        })
        
        // the profile will not have _id
        return {
            ...chat.toObject(),
            profile: profileDict[endUserId[0].toString()]
        }
    })

    const response = new ResponseCreator();
    return response
        .setStatusCode(200)
        .setMessage("chats fetched")
        .setData({ count: chats.length, chats:chatWithProfiles })
        .get();
}
