import { createUserBasicDict, IBasicUser, injectProfiles, parseUniqueIds, ResponseCreator } from '@crowdspace/common';
import { Request } from 'express'
import { PostRepoImp } from 'repositories/repositories.index.js';

export const getFeed = async (req: Request) => {
    const loggedInUser = req.headers["x-logged-in-user"] as string;

    const posts = await PostRepoImp.getFeed(loggedInUser);

    const uniqueIds = parseUniqueIds(posts, "author");

    const { body, message } = await (
        await fetch(process.env.USER_SERVICE + "/basic",
            {
                method: "POST",
                body: JSON.stringify({
                    user_ids: Array.from(uniqueIds)
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
    ).json();

    // try giving types to these methods to obtain typescript knowledge
    const profilesDict = createUserBasicDict(body.profiles);
    const postsWithAuthor = injectProfiles(posts, profilesDict, "author"); 

    const response = new ResponseCreator();
    return response
        .setStatusCode(200)
        .setMessage("feed fetched")
        .setData({ posts: postsWithAuthor })
        .get();
}