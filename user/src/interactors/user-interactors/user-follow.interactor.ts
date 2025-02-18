import { BadRequestError, ConflictError, consumerEvents, encodeEventMessage, rabbitmqConfig } from "@cr0wdspace/common";
import { FollowStatus } from "@entities/interfaces/follow.interface.js";
import { exchanges, publisherChannel, queues, routingKeys } from "@frameworks/services/events/events.service.js";
import { IFollowRepository } from "@interactors/interfaces/repositories/follow-repository.interface.js";
import { IUserRepository } from "@interactors/interfaces/repositories/user-repository.interface.js";
import { IUserFollowUsecase } from "@interactors/interfaces/user-usecase/user/userFollow-usecase.interface.js";
import { envConfig } from "@src/config/env.config.js";
import { isValidObjectId, Types } from "mongoose";

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
            .findFollowDoc(user_id, followee_id);

        if (followExists) {
            throw new ConflictError("you are already following this user");
        }

        const followeeUserData = await this._UserRepository.findUserById(followee_id.toString(), "privateAccount");

        if (followeeUserData === null) throw new BadRequestError("User to follow not found");

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
            .findFollowDoc(user_id, followee_id);

        if (!followExists) {
            throw new ConflictError("can't unfollow an unfollowed user");
        }

        const removedFollow = await this._FollowRepository.doUnfollow(user_id, followee_id);

        if (!removedFollow) {
            throw new BadRequestError("couldn't process unfollow request");
        }

        if (followExists.status === FollowStatus.active) {
            const followingsUpdated = await this._UserRepository.updateFollowingsCount(user_id, "dec")
            const followeeFollowersUpdated = await this._UserRepository.updateFollowersCount(followee_id, "dec")
        }

        // Anti-pattern in Clean 👇
        const bodyBuffer = encodeEventMessage(consumerEvents.unfollow, {
            target_id: removedFollow._id
        });
        publisherChannel.publish(exchanges.notificationFanout.name, routingKeys.content.notificationFanout, bodyBuffer);

        return removedFollow;
    }


    async updateFollowRequest(follow_doc_id: Types.ObjectId, follower_id: Types.ObjectId, followee_id: Types.ObjectId, status: FollowStatus) {
        const previousFollowDoc = await this._FollowRepository.findFollowDoc(follower_id, followee_id);
        const updatedDoc = await this._FollowRepository.updateFollowRequest(follow_doc_id, follower_id, followee_id, status);
        // writing promise.all can cause type issues. so just going with normal queries. try to find the fix 

        envConfig.NODE_ENV === 'development' && console.log(updatedDoc);

        if (previousFollowDoc === null || updatedDoc === null) { // explicit null check to easy understand code in future
            throw new BadRequestError("follow request doesn't exist");
        }

        if (updatedDoc.status === FollowStatus.active && previousFollowDoc.status === FollowStatus.pending) {
            const followingsUpdated = await this._UserRepository.updateFollowingsCount(follower_id, "inc")
            const followeeFollowersUpdated = await this._UserRepository.updateFollowersCount(followee_id, "inc")
        }

        // Anti-pattern in Clean 👇
        const bodyBuffer = encodeEventMessage(consumerEvents.follow_req_accepted, {
            recipient_id: follower_id, // the recipient is the follower here, because his request is being accepted
            follow_doc: updatedDoc.toObject()
        });
        publisherChannel.publish(exchanges.notificationFanout.name, routingKeys.content.notificationFanout, bodyBuffer);

        return updatedDoc;
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