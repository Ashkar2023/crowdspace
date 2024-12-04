import { BadRequestError, DatabaseOpError, ResponseCreator } from "@crowdspace/common";
import { Request } from "express";
import { isValidObjectId } from "mongoose";
import { CommentRepoImp } from "repositories/repositories.index.js";

export const deleteComment = async (req: Request) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new BadRequestError("not valid ID");
    }
    
    //as using findByIdAndDelete it will return the doc if deleted, the deleteResult type is not what we get
    const deleted = await CommentRepoImp.deleteComment(commentId); 
    console.log(deleted)

    if (!deleted) {
        throw new DatabaseOpError("Couldn't delete comment");
    }

    const response = new ResponseCreator();
    return response
        .setMessage("comment deleted")
        .setStatusCode(200)
        .get();
}
