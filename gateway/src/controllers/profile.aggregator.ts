import { BadRequestError, FollowStatus, ResponseCreator } from "@cr0wdspace/common";
import { Request } from "express";
import { envConfig } from "../config/env.config.js";

export const getUserProfile = async (req: Request) => {
    const username = req.params.username.replace("@", "");
    const loggedInUserId = req.headers["x-logged-in-user"] as string;
    const loggedInUsername = req.headers["x-logged-in-username"] as string;

    let requestedProfileUserId = loggedInUserId;

    let aggregatedBody: any = {}

    const userProfileFetchUrl = new URL(`/profile/@${username}`, envConfig.USER_SERVICE);

    /* MANUALLY HANDLE ERRORs on fetch */
    const userProfileFetchResponse = await fetch(userProfileFetchUrl.href, {
        method: "GET",
        headers: {
            "X-logged-in-user": req.headers['x-logged-in-user'] as string // the usual header
        }
    });

    /* CHECK if profileBody has necessary data */
    const { body: profileBody } = await userProfileFetchResponse.json();

    requestedProfileUserId = profileBody.profile._id;
    aggregatedBody.profile = profileBody.profile;
    aggregatedBody.outgoingFollow = profileBody.outgoingFollow;
    aggregatedBody.incomingFollow = profileBody.incomingFollow;

    if (
        username === loggedInUsername &&
        loggedInUserId !== profileBody.profile._id
    ) {
        throw new BadRequestError("Invalid request: Profile data mismatch")
    }

    if (
        (profileBody.profile.privateAccount && profileBody?.outgoingFollow?.status === FollowStatus.active) ||
        !profileBody.profile.privateAccount ||
        loggedInUserId === profileBody.profile._id
    ) {
        /* MANUALLY HANDLE ERRORs on fetch */
        const postsFetchUrl = new URL(`/users/${requestedProfileUserId}/posts`, envConfig.CONTENT_SERVICE);
        const postsResponse = await fetch(postsFetchUrl.href, {
            method: "GET"
        })

        const { body: postsBody, message } = await postsResponse.json();
        aggregatedBody.posts = postsBody.posts;
        aggregatedBody.accessGranted = true;
    } else {
        aggregatedBody.accessGranted = false;
    }

    const response = new ResponseCreator(); // hanlde response cases from both requests(profileData, posts)
    return response
        .setStatusCode(200)
        .setData(aggregatedBody)
        .setMessage("fetched user profile")
        .get()

}