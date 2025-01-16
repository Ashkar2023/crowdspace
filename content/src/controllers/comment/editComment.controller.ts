import { BadRequestError, ResponseCreator } from "@cr0wdspace/common";
import { Request } from "express";
import { CommentRepoImp } from "repositories/repositories.index.js";

export const editComment = async (req: Request) => {
    const loggedInUser = req.headers["x-logged-in-user"] as string;
    const commentBody = req.body.commentBody
    const { commentId } = req.params

    console.log(commentBody,commentId)

    const updatedComment = await CommentRepoImp.editComment({
        commentId,
        commentBody,
        author: loggedInUser
    })

    if(!updatedComment){
        throw new BadRequestError("comment not found");
    }

    const response = new ResponseCreator();
    return response
        .setStatusCode(200)
        .setMessage("comment edited")
        .setData({ updatedComment })
        .get();
}