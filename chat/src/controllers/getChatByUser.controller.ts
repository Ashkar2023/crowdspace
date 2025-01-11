import { AppError, BadRequestError, ResponseCreator, SocketEvents, createUserBasicDict } from "@crowdspace/common";
import { Request } from "express";
import { isValidObjectId, Types } from "mongoose";
import { chatRepoImp } from "repositories/index.repos.js";

const getChatByUser = async (req: Request) => {
    const loggedInUser = req.headers["x-logged-in-user"] as string;
    const { endUserId } = req.params;

    if (!isValidObjectId(endUserId)) {
        throw new BadRequestError("Invalid endUserId");
    }

    const userObjectId = new Types.ObjectId(loggedInUser);
    const endUserObjectId = new Types.ObjectId(endUserId);

    let chat = await chatRepoImp.findChatByParticipants(
        userObjectId,
        endUserObjectId
    );

    if (!chat) {
        chat = await chatRepoImp.createChat(userObjectId, endUserObjectId);
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

    let receiverSocketId = RetrieveCorrespondingId(endUserId);

    chat && receiverSocketId &&
        req.io.to(receiverSocketId).emit(SocketEvents.new_chat, {
            chatDoc: chatWithProfile
        })

    const response = new ResponseCreator();
    return response
        .setStatusCode(200)
        .setMessage(chat ? "fetch successful" : "chat created")
        .setData({ chat: chatWithProfile })
        .get();
};

export default getChatByUser;