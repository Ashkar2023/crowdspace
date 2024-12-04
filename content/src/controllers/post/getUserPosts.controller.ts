import { ResponseCreator } from "@crowdspace/common";
import { Request } from "express";
import { PostRepoImp } from "repositories/repositories.index.js";

export const getUserPosts = async (req: Request) => {
    const userId = req.params.user_id;

    const posts = await PostRepoImp.queryUserPosts(userId);

    const message = posts.length ?
        "fetch posts success" :
        "User has no posts";
        
    const response = new ResponseCreator()
    return response
        .setStatusCode(200)
        .setData({ posts })
        .setMessage(message)
        .get();
}