import { BadRequestError, ResponseCreator, UnauthorizedError } from "@cr0wdspace/common";
import { Request } from "express";
import { Types } from "mongoose";
import { LikeRepoImp, PostRepoImp } from "repositories/repositories.index.js";

export const getPost = async (req: Request) => {
    const { postUrl } = req.params;
    const loggedInUser = req.headers["x-logged-in-user"] as string;

    const post = await PostRepoImp.findPostByUrl(postUrl);

    if (!post) {
        throw new BadRequestError("post not found");
    }

    if (post.author.toString() === loggedInUser) {
        const liked = await LikeRepoImp.findALike(post?._id, new Types.ObjectId(loggedInUser));
        const hydratedPost = { ...post?.toObject(), author: loggedInUser, liked: Boolean(liked?._id) };

        const response = new ResponseCreator();
        const userProfile = await (
            await fetch(process.env.USER_SERVICE + `/basic/${loggedInUser}`)
        ).json();

        return response
            .setStatusCode(200)
            .setData({ post: hydratedPost, author: userProfile.body })
            .setMessage("post fetched")
            .get();
    }

    const { body, message, status } = await (
        await fetch(process.env.USER_SERVICE + `/status-connection/?follower=${loggedInUser}&followee=${post?.author}`)
    ).json();

    if (body.privateAccount && !body.outgoingFollow) {
        throw new UnauthorizedError("you don't have permissions to access this resource");
    }

    const liked = await LikeRepoImp.findALike(post?._id, new Types.ObjectId(loggedInUser));
    const hydratedPost = { ...post?.toObject(), author: body, liked: Boolean(liked?._id) };

    const response = new ResponseCreator();
    return response
        .setStatusCode(200)
        .setData({ post: hydratedPost })
        .setMessage("post fetched")
        .get();
}