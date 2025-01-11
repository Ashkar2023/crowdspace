import { ResponseCreator } from "@crowdspace/common";
import { Request } from "express";

export const getUserProfile = async (req: Request) => {
    const username = req.params.username.replace("@", "");
    const loggedInUsername = req.headers["x-logged-in-username"] as string;
    const loggedInUserId = req.headers["x-logged-in-user"] as string;

    let requestedProfileUserId = loggedInUserId;

    let aggregatedBody: any = {}

    if (loggedInUsername !== username) { // Case for handling Direct link retrievals, Ex: Client searching manually with username or opening a shared link
        const userProfileFetchUrl = new URL(`/profile/@${username}`, process.env.USER_SERVICE);

        // fetch all user details needed for profile
        const userProfileFetchResponse = await fetch(userProfileFetchUrl.href, {
            method: "GET",
            headers: {
                "X-logged-in-user": req.headers['x-logged-in-user'] as string
            }
        });

        const { body } = await userProfileFetchResponse.json();

        requestedProfileUserId = body.profile._id;
        aggregatedBody.profile = body.profile;
        aggregatedBody.outgoingFollow = body.outgoingFollow;
        aggregatedBody.incomingFollow = body.incomingFollow;
    }

    const postsFetchUrl = new URL(`/users/${requestedProfileUserId}/posts`, process.env.CONTENT_SERVICE);
    const postsResponse = await fetch(postsFetchUrl.href, {
        method: "GET"
    })

    const { body, message } = await postsResponse.json();
    aggregatedBody.posts = body.posts;

    const response = new ResponseCreator(); // hanlde response cases from both requests(profileData, posts)
    return response
        .setStatusCode(200)
        .setData(aggregatedBody)
        .setMessage("fetched user profile")
        .get()

}