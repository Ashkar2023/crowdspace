import { BadRequestError, ResponseCreator } from "@crowdspace/common";
import { Request } from "express";
import { isValidObjectId } from "mongoose";
import { CommentRepoImp } from "repositories/repos.index.js";

export const getPostComments = async (req: Request) => {
    const { postId } = req.params;

    if (!isValidObjectId(postId)) {
        throw new BadRequestError("invalid post identifier",400)
    }
    
    const comments = await CommentRepoImp.queryPostComments(postId);

    const response = new ResponseCreator();
    return response
        .setStatusCode(200)
        .setData({ comments })
        .setMessage("Comments fetched")
        .get();
} 