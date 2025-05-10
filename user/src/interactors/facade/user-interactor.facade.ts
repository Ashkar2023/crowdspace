import { FollowStatus, IFollow } from "@entities/interfaces/follow.interface.js";
import { IUser } from "@entities/interfaces/user-entity.interface.js";
import { IUserInteractorFacade } from "@interactors/interfaces/ifacade/user-interactor.facade.interface.js";
import { IFollowRepository } from "@interactors/interfaces/repositories/follow-repository.interface.js";
import { IUserRepository } from "@interactors/interfaces/repositories/user-repository.interface.js";
import { ISearchUsecase } from "@interactors/interfaces/user-usecase/user/search-usecase.interface.js";
import { IUserFollowUsecase } from "@interactors/interfaces/user-usecase/user/userFollow-usecase.interface.js";
import { IUserProfileUsecase } from "@interactors/interfaces/user-usecase/user/userProfile-usecase.interface.js";
import { SearchImp } from "@interactors/user-interactors/search.interactor.js";
import UserFollowImp from "@interactors/user-interactors/user-follow.interactor.js";
import { UserProfileImp } from "@interactors/user-interactors/user-profile.interactor.js";
import { HydratedDocument, Types } from "mongoose";

export class UserInteractorFacade implements IUserInteractorFacade {
    private _UserProfileInteractorInstance: IUserProfileUsecase;
    private _UserFollowInteractorInstance: IUserFollowUsecase;
    private _SearchInteractorInstance: ISearchUsecase

    constructor(
        _UserRepository: IUserRepository,
        _FollowRepository: IFollowRepository,
    ) {
        this._UserProfileInteractorInstance = new UserProfileImp(_UserRepository, _FollowRepository);
        this._UserFollowInteractorInstance = new UserFollowImp(_FollowRepository, _UserRepository);
        this._SearchInteractorInstance = new SearchImp(_UserRepository);
    }

    async getUserProfile(username: string, loggedInUserId: string) {
        return await this._UserProfileInteractorInstance.getUserProfile(username, loggedInUserId);
    }

    async getUserBasicProfile(userId: string) {
        return await this._UserProfileInteractorInstance.getUserBasicProfile(userId);
    }

    async getMultipleUsersBasicProfile(user_ids: string[]) {
        return await this._UserProfileInteractorInstance.getMultipleUsersBasicProfile(user_ids);
    }

    async followUser(user_id: Types.ObjectId, followee_id: Types.ObjectId) {
        return await this._UserFollowInteractorInstance.followUser(
            user_id,
            followee_id,
        )
    }

    async unfollowUser(user_id: Types.ObjectId, followee_id: Types.ObjectId) {
        return await this._UserFollowInteractorInstance.unfollowUser(
            user_id,
            followee_id
        )
    }
    async updateFollowRequest(
        follow_doc_id: Types.ObjectId,
        follower_id: Types.ObjectId,
        followee_id: Types.ObjectId,
        status: FollowStatus
    ) {
        return await this._UserFollowInteractorInstance.updateFollowRequest(follow_doc_id, follower_id, followee_id, status);
    }

    async getFollowersAndFollowees(user_id: Types.ObjectId) {
        return await this._UserFollowInteractorInstance.getFollowersAndFollowees(user_id);
    }

    async search(query: string) {
        return await this._SearchInteractorInstance.search(query);
    }

    async removeFollower(follower_id: string, loggedInUserId: string) {
        return await this._UserFollowInteractorInstance.removeFollower(follower_id, loggedInUserId);
    }

    async getFollowers(user_id: string, page: number) {
        return await this._UserFollowInteractorInstance.getFollowers(user_id, page)
    }

    async getFollowings(user_id: string, page: number) {
        return await this._UserFollowInteractorInstance.getFollowings(user_id, page)
    }

    async getAccountStatusAndConnection(follower: Types.ObjectId, followee: Types.ObjectId){
        return await this._UserProfileInteractorInstance.getAccountStatusAndConnection(follower, followee);
    }
}