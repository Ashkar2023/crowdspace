import { BadRequestError, ResponseCreator } from "@crowdspace/common";
import { Request, response } from "express";
import { isValidObjectId, Schema, Types } from "mongoose";
import { LikeRepoImp, PostRepoImp } from "repositories/repositories.index.js";

export const likePost = async (req: Request) => {
    const post_id = req.params.postId;
    const loggedInUserId = req.headers["x-logged-in-user"] as string; // user._id now

    if (!isValidObjectId(post_id)) {
        throw new BadRequestError("invalid postId");
    } else if (!isValidObjectId(loggedInUserId)) {
        throw new BadRequestError("invalid userId");
    }

    const post = await PostRepoImp.findPost(post_id);

    if (!post) {
        throw new BadRequestError("post not found");
    }

    const liked = await LikeRepoImp.createLikeIfNotExists({
        author: new Types.ObjectId(loggedInUserId),
        post_id: new Types.ObjectId(post_id)
    });

    const existingLike = liked?.lastErrorObject?.updatedExisting;

    const response = new ResponseCreator()
    return response
        .setData({
            action: "liked",
            existingLike: true
        })
        .setMessage(existingLike ? "post liked" : "like record exists")
        .setStatusCode(201)
        .get()
}
