import { BadRequestError, ConflictError, ResponseCreator } from "@crowdspace/common";
import { Request } from "express";
import { isValidObjectId, Types } from "mongoose";
import { LikeRepoImp } from "repositories/repos.index.js";

export const unlikePost = async (req: Request) => {
    const post_id = req.params.postId;
    const userUUID = req.headers["x-logged-in-user"] as string; // user._id now

    if (!isValidObjectId(post_id)) {
        throw new BadRequestError("invalid postId");
    } else if (!isValidObjectId(userUUID)) {
        throw new BadRequestError("invalid userId");
    }

    const unliked = await LikeRepoImp.deleteLike({
        post_id: new Types.ObjectId(post_id),
        author: new Types.ObjectId(userUUID)
    });

    if (!unliked) {
        throw new ConflictError("like record doesn't exist")
    }

    const response = new ResponseCreator()
    return response
        .setMessage("post unliked")
        .setData({ action: "unliked" })
        .setStatusCode(204) //NO CONTENT as no additional info is needed
        .get()
}
