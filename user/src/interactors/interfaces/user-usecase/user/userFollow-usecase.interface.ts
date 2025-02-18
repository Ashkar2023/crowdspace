import { FollowStatus, IFollow } from "@entities/interfaces/follow.interface.js";
import { HydratedDocument, Types } from "mongoose";

export interface IUserFollowUsecase {
    followUser: (
        user_id: Types.ObjectId,
        followee_id: Types.ObjectId,
    ) => Promise<HydratedDocument<IFollow> | null>;

    unfollowUser: (
        user_id: Types.ObjectId,
        followee_id: Types.ObjectId,
    ) => Promise<HydratedDocument<IFollow> | null>;

    getFollowersAndFollowees: (user_id: Types.ObjectId) => Promise<{
        followers: HydratedDocument<IFollow>[] | [],
        followings: HydratedDocument<IFollow>[] | [],
        followersCount: number,
        followingsCount: number
    }>

    updateFollowRequest: (
        follow_doc_id: Types.ObjectId,
        follower_id: Types.ObjectId,
        followee_id: Types.ObjectId,
        status: FollowStatus
    ) => Promise<HydratedDocument<IFollow> | null>

    removeFollower: (follower_id: string, loggedInUserId: string) => Promise<HydratedDocument<IFollow> | null>;

    getFollowers: (user_id: string, page: number) => Promise<HydratedDocument<IFollow>[]>
    getFollowings: (user_id: string, page: number) => Promise<HydratedDocument<IFollow>[]>
}