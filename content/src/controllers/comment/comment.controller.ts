import { BadRequestError, DatabaseOpError, ResponseCreator } from "@crowdspace/common";
import { Request } from "express";
import { isValidObjectId, Types } from "mongoose";
import { CommentRepoImp, PostRepoImp } from "repositories/repos.index.js";

export const createComment = async (req: Request) => {
    const { post_id, commentBody, replyFor } = req.body;
    const author = req.headers["x-logged-in-user"] as string;

    if (!isValidObjectId(post_id)) {
        throw new BadRequestError("invalid post identifier");
    }

    const post = await PostRepoImp.findPost(post_id);

    if (!post) {
        throw new BadRequestError("post not found");
    }

    const comment = await CommentRepoImp.createComment({
        commentBody,
        replyFor,
        post_id,
        author: new Types.ObjectId(author)
    });

    const response = new ResponseCreator();
    return response
        .setData({ comment })
        .setMessage("Comment created!")
        .setStatusCode(201)
        .get();
}


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

    const response = new ResponseCreator();
    return response
        .setMessage("comment deleted")
        .setStatusCode(200)
        .get();
}
