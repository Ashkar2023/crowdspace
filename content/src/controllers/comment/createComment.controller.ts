import { consumerEvents, BadRequestError, encodeEventMessage, NotificationKind, ResponseCreator, rabbitmqConfig } from "@crowdspace/common";
import { publisherChannel } from "events/index.js";
import { Request } from "express";
import { isValidObjectId, Types } from "mongoose";
import { CommentRepoImp, NotificationRepoImp, PostRepoImp } from "repositories/repositories.index.js";

export const createComment = async (req: Request) => {
    const { post_id, commentBody, replyFor } = req.body;
    const loggedInUserId = req.headers["x-logged-in-user"] as string;

    if (!isValidObjectId(post_id)) {
        throw new BadRequestError("invalid post identifier");
    }

    let replyForComment,
        queries = [];

    if (replyFor) {
        if (!isValidObjectId(replyFor)) {
            throw new BadRequestError("invalid comment Identifier")
        }
        replyForComment = CommentRepoImp.findComment(replyFor);
        queries.push(replyForComment);
    }

    const post = PostRepoImp.findPost(post_id);
    queries.unshift(post);

    const queryResults = await Promise.allSettled(queries);

    //@ts-ignore //FIX
    if (!queryResults[0].value) {
        throw new BadRequestError("post not found");
    }

    //@ts-ignore //FIX
    if (replyFor && !queryResults[1].value) {
        throw new BadRequestError("comment to reply to, not found");
    }

    //@ts-ignore //FIX
    if (replyFor && queryResults[1].value.replyFor) {
        throw new BadRequestError("cannot reply to a reply-comment");
    }

    const comment = await CommentRepoImp.createComment({
        commentBody,
        replyFor,
        post_id,
        author: new Types.ObjectId(loggedInUserId)
    });


    //@ts-ignore //FIX
    if (queryResults[0].value.author.toString() !== loggedInUserId) {
        const commentNotification = await NotificationRepoImp.createNotification({
            actor: comment.author,
            // @ts-ignore
            recipient_id: queryResults[0].value.author as Types.ObjectId,
            target: comment._id,
            type: NotificationKind.comment,
            is_read: false
        })

        const messageBuffer = encodeEventMessage(consumerEvents.new_comment, commentNotification);

        const published = publisherChannel.publish(
            rabbitmqConfig.exchanges.notificationFanout.name,
            rabbitmqConfig.routingKeys.chat.notificationFanout,
            messageBuffer
        );
    }

    const response = new ResponseCreator();
    return response
        .setData({ comment })
        .setMessage("Comment created!")
        .setStatusCode(201)
        .get();
}

