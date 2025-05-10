import { BadRequestError, consumerEvents, DatabaseOpError, encodeEventMessage, rabbitmqConfig, ResponseCreator } from "@cr0wdspace/common";
import { publisherChannel } from "events/index.js";
import { Request } from "express";
import { isValidObjectId, Types } from "mongoose";
import { CommentRepoImp, NotificationRepoImp } from "repositories/repositories.index.js";

export const deleteComment = async (req: Request) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new BadRequestError("not valid ID");
    }

    //as using findByIdAndDelete it will return the doc if deleted, the deleteResult type is not what we get
    const deleted = await CommentRepoImp.deleteComment(commentId);

    if (!deleted) {
        throw new DatabaseOpError("Couldn't delete comment");
    }

    const deletedNotification = await NotificationRepoImp.deleteNotificationByTargetId(new Types.ObjectId(commentId))
    
    const messageBuffer = encodeEventMessage(consumerEvents.delete_comment, { ...deletedNotification, post_id: deleted.post_id });
    const published = publisherChannel.publish(
        rabbitmqConfig.exchanges.notificationFanout.name,
        rabbitmqConfig.routingKeys.chat.notificationFanout,
        messageBuffer
    );

    const response = new ResponseCreator();
    return response
        .setMessage("comment deleted")
        .setStatusCode(200)
        .get();
}
