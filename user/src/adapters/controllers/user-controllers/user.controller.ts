import { IUserInteractorFacade } from "@interactors/interfaces/ifacade/user-interactor.facade.interface.js";
import { IUserController } from "../interfaces/user-controller.interface.js";
import { BadRequestError, IResponse, ResponseCreator } from "@crowdspace/common";
import { Request } from "express";
import { isValidObjectId, ObjectId, Types } from "mongoose";

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


    async followUser(req: Request) {
        const loggedinUser = req.headers["x-logged-in-user"] as string;
        const { user_id: followee_id } = req.params;
        const { privateAccount } = req.body;

        if (!isValidObjectId(followee_id)) {
            throw new BadRequestError('invalid identifier');
        }

        const followResult = await this._UserInteractorFacade.followUser(
            new Types.ObjectId(loggedinUser),
            new Types.ObjectId(followee_id),
            privateAccount
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


    async getFollows(req: Request) {
        const user_id = req.params.user_id as string;
        console.log(req.params);

        const follows = await this._UserInteractorFacade.getFollowersAndFollowees(new Types.ObjectId(user_id));

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("fetched follows")
            .setData(follows)
            .get();
    }
}