import { BadRequestError, ConflictError, consumerEvents, encodeEventMessage, rabbitmqConfig } from "@cr0wdspace/common";
import { FollowStatus, IFollow } from "@entities/interfaces/follow.interface.js";
import { publisherChannel } from "@frameworks/services/events/events.service.js";
import { IFollowRepository } from "@interactors/interfaces/repositories/follow-repository.interface.js";
import { IUserRepository } from "@interactors/interfaces/repositories/user-repository.interface.js";
import { IUserFollowUsecase } from "@interactors/interfaces/user-usecase/user/userFollow-usecase.interface.js";
import { HydratedDocument, isValidObjectId, Types } from "mongoose";

class UserFollowImp implements IUserFollowUsecase {

    constructor(
        private _FollowRepository: IFollowRepository,
        private _UserRepository: IUserRepository
    ) {

    }

    async followUser(
        user_id: Types.ObjectId,
        followee_id: Types.ObjectId,
    ) {

        const followExists = await this._FollowRepository
            .followExists(user_id, followee_id);

        if (followExists) {
            throw new ConflictError("you are already following this user");
        }

        const followeeUserData = await this._UserRepository.findUserById(followee_id.toString(), "privateAccount");

        if(followeeUserData === null) throw new BadRequestError("User to follow not found");

        const follow = await this._FollowRepository.doFollow(user_id, followee_id, followeeUserData?.privateAccount!);

        if (follow.status === FollowStatus.active) {
            const followingsUpdated = await this._UserRepository.updateFollowingsCount(user_id, "inc")
            const followeeFollowersUpdated = await this._UserRepository.updateFollowersCount(followee_id, "inc")
        }

        // Anti-pattern in Clean 👇
        const bodyBuffer = encodeEventMessage(
            followeeUserData?.privateAccount ?
                consumerEvents.follow_request :
                consumerEvents.follow,
            {
                recipient_id: followee_id, //redundant but the notifications handler(chat service) resolves socket id with this field
                follower_id: user_id,
                followee_id,
                follow_doc: follow
            }
        );

        publisherChannel.publish(
            rabbitmqConfig.exchanges.notificationFanout.name,
            rabbitmqConfig.routingKeys.user.notificationFanout,
            bodyBuffer
        );

        return follow;
    }


    async unfollowUser(
        user_id: Types.ObjectId,
        followee_id: Types.ObjectId
    ) {

        const followExists = await this._FollowRepository
            .followExists(user_id, followee_id);

        if (!followExists) {
            throw new ConflictError("can't unfollow an unfollowed user");
        }

        const removedFollow = await this._FollowRepository.doUnfollow(user_id, followee_id);

        if (!removedFollow) {
            throw new BadRequestError("couldn't process unfollow request");
        }

        const followingsUpdated = await this._UserRepository.updateFollowingsCount(user_id, "dec")
        const followeeFollowersUpdated = await this._UserRepository.updateFollowersCount(followee_id, "dec")

        // Anti-pattern in Clean 👇
        const bodyBuffer = encodeEventMessage(consumerEvents.unfollow, {
            notification_id: removedFollow._id
        });
        publisherChannel.publish("content-exchange", "notify", bodyBuffer);

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

    async removeFollower(follower_id: string, loggedInUserId: string) {

        if (!isValidObjectId(follower_id)) {
            throw new BadRequestError("Invalid follower id");
        }

        const deleted = await this._FollowRepository.removeFollower(
            new Types.ObjectId(follower_id),
            new Types.ObjectId(loggedInUserId)
        );

        return deleted
    };

    async getFollowings(user_id: string, page: number) {

        if (!isValidObjectId(user_id)) {
            throw new BadRequestError("Invalid user id");
        }

        const followings = await this._FollowRepository.getFollowings(new Types.ObjectId(user_id), page);

        return followings
    }

    async getFollowers(user_id: string, page: number) {
        if (!isValidObjectId(user_id)) {
            throw new BadRequestError("Invalid user id");
        }

        const followers = await this._FollowRepository.getFollowers(new Types.ObjectId(user_id), page);

        return followers
    }
}

export default UserFollowImp;