import { asyncEvents, BadRequestError, encodeEventMessage, ResponseCreator } from "@crowdspace/common";
import ContentMsgBroker, { publisherChannel } from "events/index.js";
import { Request } from "express";
import { PostRepoImp } from "repositories/index.repositories.js";

export const deletePost = async (req: Request) => {
    const { postId } = req.params;
    console.log(postId);

    const postToDelete = await PostRepoImp.findPost(postId);

    if (!postToDelete) {
        throw new BadRequestError("post not found");
    }

    const deleted = await PostRepoImp.deletePost(postId);
    console.log(deleted);

    const bodyObject = encodeEventMessage(asyncEvents.post_deleted, {
        postId: postToDelete._id,
        mediaUrls: postToDelete.media.map(item => {
            return item.media_url;
        })
    })

    // // 👇 This would throw error as it is not acknowledged in the media as of now, uncomment when the logic is written in media service
    // const published = publisherChannel.publish("content-exchange", "", bodyObject); 

    // if (!published) {
    //     //learn rabbitmq errors
    // }

    const response = new ResponseCreator();
    return response
        .setStatusCode(200)
        .setMessage("post has been deleted successfully")
        .setData({})
        .get();
}