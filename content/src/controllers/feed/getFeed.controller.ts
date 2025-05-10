import { createUserBasicDict, IBasicUser, injectProfiles, parseUniqueIds, ResponseCreator } from '@cr0wdspace/common';
import { Request } from 'express'
import { HydratedDocument, Types } from 'mongoose';
import { LikeRepoImp, PostRepoImp } from 'repositories/repositories.index.js';
import { validator } from 'services/schema.validator.js';
import z from 'zod';
import { T_Post } from '~types/post.types.js';

export const getFeed = async (req: Request) => {
    const loggedInUser = req.headers["x-logged-in-user"] as string;
    const page = req.query.page;

    // you could update the normal validate to have this behaviour and avoid this method
    validator.coerceAndValidate<string, number>(page as string, z.coerce.number().finite({message: "input not valid"}).positive() );

    const posts = await PostRepoImp.getFeed(loggedInUser, page ? +page : 0 ); // +page coercsion

    const postsIds = posts.map(post => post._id);

    const likesOnPosts = await LikeRepoImp.findLikes(postsIds, new Types.ObjectId(loggedInUser));
    const likedPostIdSet = new Set(likesOnPosts.map(like=>like.post_id.toString()));

    const uniqueAuthorIds = parseUniqueIds(posts, "author");

    const { body, message } = await (
        await fetch(process.env.USER_SERVICE + "/basic",
            {
                method: "POST",
                body: JSON.stringify({
                    user_ids: Array.from(uniqueAuthorIds)
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
    ).json();

    // try giving types to these methods to obtain typescript knowledge
    const profilesDict = createUserBasicDict(body.profiles);
    const postsWithAuthor = injectProfiles(posts, profilesDict, "author") as HydratedDocument<T_Post>[];
    const finalPosts = postsWithAuthor.map(post=>({
        ...post,
        liked: likedPostIdSet.has(post._id.toString())
    }))

    const response = new ResponseCreator();
    return response
        .setStatusCode(200)
        .setMessage("feed fetched")
        .setData({ posts: finalPosts })
        .get();
}