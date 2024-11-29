import { ResponseCreator } from "@crowdspace/common";
import { Request } from "express";

export const getUserProfile = async (req: Request) => {
    const username = req.params.username.replace("@","");
    const loggedInUsername = req.headers["x-logged-in-username"] as string;
    const loggedInUserId = req.headers["x-logged-in-user"] as string;

    console.table({ username, loggedInUserId, loggedInUsername })
    let requestedProfileUserId = loggedInUserId;

    /**
     * CHANGE IMPORTANT
     * Using ObjectId's for now. should change both JWT & other usecases of userId to UUID 
     *  
     * After changing it to UUID, should retrieve the userId from the database if the posts are having userId only,
     * Or add the UUID to the posts documents
     *   
     */

    if (loggedInUsername !== username) { // Case for handling Direct link retrievals, Ex: Client searching manually with username or opening a shared link
        const userProfileFetchUrl = new URL(`/profile/@${username}`, process.env.USER_SERVICE);

        // fetch all user details needed for profile
        const userProfileFetchResponse = await fetch(userProfileFetchUrl.href, {
            method: "GET"
        });

        const { body } = await userProfileFetchResponse.json();

        requestedProfileUserId = body.profile._id;
    }

    const postsFetchUrl = new URL(`/users/${requestedProfileUserId}/posts`, process.env.CONTENT_SERVICE);
    const postsResponse = await fetch(postsFetchUrl.href, {
        method: "GET"
    })

    const { body, message } = await postsResponse.json();

    const response = new ResponseCreator(); // hanlde response cases from both requests(profileData, posts)
    return response
        .setStatusCode(200)
        .setData({ posts: body.posts })
        .setMessage(message)
        .get()

}