import { BadRequestError } from "@crowdspace/common";
import { IUser } from "@entities/interfaces/user-entity.interface.js";
import { IFollowRepository } from "@interactors/interfaces/repositories/follow-repository.interface.js";
import { IUserRepository } from "@interactors/interfaces/repositories/user-repository.interface.js";
import { IUserProfileUsecase } from "@interactors/interfaces/user-usecase/user/userProfile-usecase.interface.js";
import { HydratedDocument } from "mongoose";
import { Types } from "mongoose";

export class UserProfileImp implements IUserProfileUsecase {

    constructor(
        private _UserRepository: IUserRepository,
        private _FollowRepository: IFollowRepository
    ) {

    }

    async getUserBasicProfile(userId: string) {
        const userBasicProfile = await this._UserRepository.findUserById(userId,
            "username displayname avatar"
        )

        return userBasicProfile;
    }

    async getUserProfile(username: string, loggedInUserId: string) {
        const userProfile = await this._UserRepository.getProfile(username);

        if (!userProfile) {
            throw new BadRequestError("user not found", 400);
        }

        const connection = await this._FollowRepository.findConnection(
            new Types.ObjectId(loggedInUserId),
            new Types.ObjectId(userProfile._id)
        );

        return {
            profile: userProfile,
            ...connection
        }
    }

    async getMultipleUsersBasicProfile(user_ids: string[]) {
        const profiles = await this._UserRepository.findMultipleUsersById(user_ids,
            "username displayname avatar"
        )

        return profiles 
    };
}