import { BadRequestError, ConflictError, consumerEvents, encodeEventMessage, rabbitmqConfig, ResponseCreator } from "@cr0wdspace/common";
import { publisherChannel } from "events/index.js";
import { Request } from "express";
import { isValidObjectId, Types } from "mongoose";
import { LikeRepoImp, NotificationRepoImp } from "repositories/repositories.index.js";

export const unlikePost = async (req: Request) => {
    const post_id = req.params.postId;
    const loggedInUserId = req.headers["x-logged-in-user"] as string;

    if (!isValidObjectId(post_id)) {
        throw new BadRequestError("invalid postId");
    } else if (!isValidObjectId(loggedInUserId)) {
        throw new BadRequestError("invalid userId");
    }

    const unliked = await LikeRepoImp.deleteLike({
        post_id: new Types.ObjectId(post_id),
        author: new Types.ObjectId(loggedInUserId)
    });

    if (!unliked) {
        throw new ConflictError("like record doesn't exist")
    } else {
        /* FIX make this function call in consumer, publish the deleted like through the queue */ 
        const deletedNotification = await NotificationRepoImp.deleteNotificationByTargetId(unliked._id);

        /* publish & Update likes count */
        const bodyBuffer = encodeEventMessage(consumerEvents.unlike, { post_id });
        publisherChannel.publish(
            rabbitmqConfig.exchanges.notificationFanout.name,
            rabbitmqConfig.routingKeys.chat.notificationFanout,
            bodyBuffer
        );
    }

    const response = new ResponseCreator()
    return response
        .setMessage("post unliked")
        .setData({ action: "unliked" })
        .setStatusCode(204) //NO CONTENT as no additional info is needed
        .get()
}
