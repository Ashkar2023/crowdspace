import { consumerEvents, BadRequestError, encodeEventMessage, NotificationKind, ResponseCreator, rabbitmqConfig } from "@cr0wdspace/common";
import { publisherChannel } from "events/index.js";
import { Request, response } from "express";
import { Document, isValidObjectId, Schema, Types } from "mongoose";
import { LikeRepoImp, NotificationRepoImp, PostRepoImp } from "repositories/repositories.index.js";

export const likePost = async (req: Request) => {
    const post_id = req.params.postId;
    const loggedInUserId = req.headers["x-logged-in-user"] as string;

    if (!isValidObjectId(post_id)) {
        throw new BadRequestError("invalid postId");
    } else if (!isValidObjectId(loggedInUserId)) {
        throw new BadRequestError("invalid userId");
    }

    const post = await PostRepoImp.findPost(post_id);

    if (!post) {
        throw new BadRequestError("post not found");
    }

    const like = await LikeRepoImp.createLikeIfNotExists({
        author: new Types.ObjectId(loggedInUserId),
        post_id: new Types.ObjectId(post_id)
    });

    const existingLike = like?.lastErrorObject?.updatedExisting;

    if (!existingLike
        && like?.value?.author.toString() === loggedInUserId
    ) {
        // change this to consumer and also create the notification delete when unliked
        const notification = await NotificationRepoImp.createNotification({
            actor: new Types.ObjectId(loggedInUserId),
            is_read: false,
            recipient_id: new Types.ObjectId(post.author),
            target: new Types.ObjectId(like.value._id),
            type: NotificationKind.like,
        })

        /* publish & Update likes count */
        const bodyBuffer = encodeEventMessage(consumerEvents.new_like, { ...notification.toObject(), post_id });
        publisherChannel.publish(
            rabbitmqConfig.exchanges.notificationFanout.name,
            rabbitmqConfig.routingKeys.chat.notificationFanout,
            bodyBuffer
        );
    }

    const response = new ResponseCreator()
    return response
        .setData({
            action: "liked",
            existingLike
        })
        .setMessage(!existingLike ? "post liked" : "like record exists")
        .setStatusCode(201)
        .get()
}
