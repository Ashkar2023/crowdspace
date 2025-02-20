import { IUserInteractorFacade } from "@interactors/interfaces/ifacade/user-interactor.facade.interface.js";
import { IUserController } from "../interfaces/user-controller.interface.js";
import { BadRequestError, IResponse, ResponseCreator } from "@cr0wdspace/common";
import { Request } from "express";
import { isValidObjectId, Types } from "mongoose";
import { FollowStatus } from "@entities/interfaces/follow.interface.js";

export class UserController implements IUserController {

    constructor(
        private _UserInteractorFacade: IUserInteractorFacade,
    ) {

    }

    async getUserProfile(req: Request) {
        const username = req.params.username.replace("@", "");
        const loggedInUserId = req.headers["x-logged-in-user"] as string;

        const profileAndConnections = await this._UserInteractorFacade.getUserProfile(username, loggedInUserId);

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("profile details fetched")
            .setData({
                profile: profileAndConnections.profile,
                incomingFollow: profileAndConnections.incomingFollow,
                outgoingFollow: profileAndConnections.outgoingFollow
            })
            .get();
    };

    async getUserBasicProfile(req: Request) {
        const userId = req.params.user_id;

        const userBasicProfile = await this._UserInteractorFacade.getUserBasicProfile(userId);

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("user basic profile fetched")
            .setData({ ...userBasicProfile?.toObject() })
            .get();
    }

    async getMultipleUsersBasicProfile(req: Request) {
        const { user_ids } = req.body;

        const profiles = await this._UserInteractorFacade.getMultipleUsersBasicProfile(user_ids);

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage(profiles.length ? "profiles fetched" : "no profiles found")
            .setData({ profiles })
            .get();
    };

    async followUser(req: Request) {
        const loggedinUser = req.headers["x-logged-in-user"] as string;
        const { user_id: followee_id } = req.params;

        if (!isValidObjectId(followee_id)) {
            throw new BadRequestError('invalid identifier');
        }

        const followResult = await this._UserInteractorFacade.followUser(
            new Types.ObjectId(loggedinUser),
            new Types.ObjectId(followee_id),
        )

        const response = new ResponseCreator();
        return response
            .setStatusCode(201)
            .setMessage("user followed")
            .setData({ ...followResult?.toObject(), _id: null })
            .get();
    };


    async unfollowUser(req: Request) {
        const loggedinUser = req.headers["x-logged-in-user"] as string;
        const { user_id: followee_id } = req.params;

        if (!isValidObjectId(followee_id)) {
            throw new BadRequestError('invalid identifier');
        }

        await this._UserInteractorFacade.unfollowUser(
            new Types.ObjectId(loggedinUser),
            new Types.ObjectId(followee_id),
        )

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("user unfollowed")
            .setData({})
            .get();
    };


    async acceptFollowRequest(req: Request) {
        const loggedinUser = req.headers["x-logged-in-user"] as string;
        const { followerId } = req.body as Record<string, string>;
        const { follow_doc_id: followDocId } = req.params;

        [followerId, followDocId].forEach(id => {
            if (!isValidObjectId(id)) throw new BadRequestError("invalid id");
        })

        const followDoc = await this._UserInteractorFacade.updateFollowRequest(
            new Types.ObjectId(followDocId),
            new Types.ObjectId(followerId),
            new Types.ObjectId(loggedinUser),
            FollowStatus.active
        );

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("follow request accepted")
            .setData({ ...followDoc?.toObject() })
            .get()
    };


    // async getFollows(req: Request) {
    //     const user_id = req.params.user_id as string;
    //     console.log(req.params);

    //     const follows = await this._UserInteractorFacade.getFollowersAndFollowees(new Types.ObjectId(user_id));

    //     const response = new ResponseCreator();
    //     return response
    //         .setStatusCode(200)
    //         .setMessage("fetched follows")
    //         .setData(follows)
    //         .get();
    // }

    async search(req: Request) {
        const { q } = req.query;

        const results = await this._UserInteractorFacade.search(q as string);

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("search success")
            .setData({ results })
            .get();
    }

    async removeFollower(req: Request) {
        const { follower_id } = req.params;
        const loggedInUserId = req.headers["x-logged-in-user"] as string;

        // VALIDATE

        const deleted = await this._UserInteractorFacade.removeFollower(follower_id, loggedInUserId);

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("follower removed")
            .setData({})
            .get();
    }

    async getFollowers(req: Request) {
        const page = req.query.page as string;
        const { user_id } = req.params;
        // const loggedInUserId = req.headers["x-logged-in-user"] as string;
        
        const followers = await this._UserInteractorFacade.getFollowers(user_id, +page)
        
        const response = new ResponseCreator();
        return response
        .setStatusCode(200)
        .setMessage("followers fetched")
        .setData(followers)
        .get();
    };
    
    async getFollowings(req: Request) {
        const page = req.query.page as string;
        const { user_id } = req.params;
        // const loggedInUserId = req.headers["x-logged-in-user"] as string;

        const followings = await this._UserInteractorFacade.getFollowings(user_id, +page)

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("followings fetched")
            .setData(followings)
            .get();

    };
}