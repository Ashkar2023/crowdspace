import { AllSettledQueryResult, BadRequestError, DatabaseOpError, ResponseCreator } from "@crowdspace/common";
import { Request } from "express";
import { HydratedDocument, isValidObjectId, Types } from "mongoose";
import { CommentRepoImp, PostRepoImp } from "repositories/repositories.index.js";
import { IComment } from "~types/comment.types.js";
import { T_Post } from "~types/post.types.js";

export const createComment = async (req: Request) => {
    const { post_id, commentBody, replyFor } = req.body;
    const author = req.headers["x-logged-in-user"] as string;

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

    const queryResults: {
    } = await Promise.allSettled(queries);

    //@ts-ignore //FIX
    if (!queryResults[0].value) {
        throw new BadRequestError("post not found");
    }
    
    //@ts-ignore //FIX
    if (replyFor && !queryResults[1].value) {
        throw new BadRequestError("comment not found");
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

