import { BadRequestError, ConflictError } from "@crowdspace/common";
import { IFollow } from "@entities/interfaces/follow.interface.js";
import { IFollowRepository } from "@interactors/interfaces/repositories/follow-repository.interface.js";
import { IUserFollowUsecase } from "@interactors/interfaces/user-usecase/user/userFollow-usecase.interface.js";
import { HydratedDocument, Types } from "mongoose";

class UserFollowImp implements IUserFollowUsecase {

    constructor(
        private _FollowRepository: IFollowRepository,
    ) {

    }

    async followUser(
        user_id: Types.ObjectId,
        followee_id: Types.ObjectId,
        followee_private: boolean
    ) {

        const followExists = await this._FollowRepository
            .followExists(user_id, followee_id);

        if (followExists) {
            throw new ConflictError("you are already following this user");
        }

        const createFollow = await this._FollowRepository.doFollow(user_id, followee_id, followee_private);

        /* UPDATE follow count by firing an event to message Broker */

        return createFollow;
    }


    async unfollowUser(
        user_id: Types.ObjectId,
        followee_id: Types.ObjectId
    ) {

        const removedFollow = await this._FollowRepository.doUnfollow(user_id, followee_id);

        if (!removedFollow) {
            throw new BadRequestError("you are not following this user")
        }

        // update follow count by event queue

        return removedFollow;
    }

    async getFollowersAndFollowees(user_id: Types.ObjectId) {
        const result = await this._FollowRepository.getFollowersAndFollowees(user_id);

        if (!result) {
            throw new BadRequestError("Unable to fetch followers and followings for the user");
        }

        return {
            followers: result.followers || [],
            followings: result.followings || [],
            followersCount: result.followersCount || 0,
            followingsCount: result.followingsCount || 0,
        };
    }

}

export default UserFollowImp;