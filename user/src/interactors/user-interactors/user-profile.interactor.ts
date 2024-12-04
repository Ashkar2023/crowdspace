import { BadRequestError } from "@crowdspace/common";
import { IFollowRepository } from "@interactors/interfaces/repositories/follow-repository.interface.js";
import { IUserRepository } from "@interactors/interfaces/repositories/user-repository.interface.js";
import { IUserProfileUsecase } from "@interactors/interfaces/user-usecase/user/userProfile-usecase.interface.js";
import { Types } from "mongoose";

export class UserProfileImp implements IUserProfileUsecase {

    constructor(
        private _UserRepository: IUserRepository,
        private _FollowRepository: IFollowRepository
    ) {

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
            // outgoingFollow: connection.outgoingFollow,
            // incomingFollow: connection.incomingFollow
        }
    }
}