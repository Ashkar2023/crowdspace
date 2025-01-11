import { BadRequestError, createUserBasicDict, injectProfiles, parseUniqueIds, ResponseCreator } from "@crowdspace/common";
import { Request } from "express";
import { isValidObjectId } from "mongoose";
import { CommentRepoImp } from "repositories/repositories.index.js";

export const getPostComments = async (req: Request) => {
    const { postId } = req.params;
    // const loggedInUser = req.headers["x-logged-in-user"] as string;

    if (!isValidObjectId(postId)) {
        throw new BadRequestError("invalid post identifier", 400)
    }

    const comments = await CommentRepoImp.getPostComments(postId);

    const uniqueIdSet = parseUniqueIds(comments, "author");

    const { body, message } = await (
        await fetch(process.env.USER_SERVICE + "/basic",
            {
                method: "POST",
                body: JSON.stringify({
                    user_ids: Array.from(uniqueIdSet)
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
    ).json();

    const profileDict = createUserBasicDict(body.profiles, false);

    const commentsWithProfile = injectProfiles(comments, profileDict, "author");

    const response = new ResponseCreator();
    return response
        .setStatusCode(200)
        .setData({ comments: commentsWithProfile })
        .setMessage("Comments fetched")
        .get();
} 