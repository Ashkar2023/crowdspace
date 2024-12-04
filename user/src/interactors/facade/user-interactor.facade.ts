import { IFollow } from "@entities/interfaces/follow.interface.js";
import { IUserInteractorFacade } from "@interactors/interfaces/ifacade/user-interactor.facade.interface.js";
import { IFollowRepository } from "@interactors/interfaces/repositories/follow-repository.interface.js";
import { IUserRepository } from "@interactors/interfaces/repositories/user-repository.interface.js";
import { IUserFollowUsecase } from "@interactors/interfaces/user-usecase/user/userFollow-usecase.interface.js";
import { IUserProfileUsecase } from "@interactors/interfaces/user-usecase/user/userProfile-usecase.interface.js";
import UserFollowImp from "@interactors/user-interactors/user-follow.interactor.js";
import { UserProfileImp } from "@interactors/user-interactors/user-profile.interactor.js";
import { HydratedDocument, Types } from "mongoose";

export class UserInteractorFacade implements IUserInteractorFacade {
    private _UserProfileInteractorInstance: IUserProfileUsecase;
    private _UserFollowInteractorInstance: IUserFollowUsecase;

    constructor(
        _UserRepository: IUserRepository,
        _FollowRepository: IFollowRepository,
    ) {
        this._UserProfileInteractorInstance = new UserProfileImp(_UserRepository, _FollowRepository);
        this._UserFollowInteractorInstance = new UserFollowImp(_FollowRepository);
    }

    async getUserProfile(username: string, loggedInUserId: string) {
        return await this._UserProfileInteractorInstance.getUserProfile(username, loggedInUserId);
    }

    async followUser(user_id: Types.ObjectId, followee_id: Types.ObjectId, followee_private: boolean) {
        return await this._UserFollowInteractorInstance.followUser(
            user_id,
            followee_id,
            followee_private
        )
    }

    async unfollowUser(user_id: Types.ObjectId, followee_id: Types.ObjectId) {
        return await this._UserFollowInteractorInstance.unfollowUser(
            user_id,
            followee_id
        )
    }

    async getFollowersAndFollowees(user_id: Types.ObjectId) {
        return await this._UserFollowInteractorInstance.getFollowersAndFollowees(user_id);
    }
}