import { FollowStatus, IFollow } from "@entities/interfaces/follow.interface.js";
import { HydratedDocument, Types } from "mongoose";

export interface IFollowRepository {
    doUnfollow: (
        follower_id: Types.ObjectId,
        followee_id: Types.ObjectId,
    ) => Promise<HydratedDocument<IFollow> | null>

    doFollow: (
        follower_id: Types.ObjectId,
        followee_id: Types.ObjectId,
        followee_private: boolean
    ) => Promise<HydratedDocument<IFollow>>
    
    updateFollowRequest: (
        follow_doc_id: Types.ObjectId,
        follower_id: Types.ObjectId,
        followee_id: Types.ObjectId,
        status: FollowStatus
    ) => Promise<HydratedDocument<IFollow> | null>

    findConnection: (
        follower_id: Types.ObjectId,
        followee_id: Types.ObjectId,
    ) => Promise<{
        outgoingFollow: HydratedDocument<IFollow> | null,
        incomingFollow: HydratedDocument<IFollow> | null
    }>

    findFollowDoc: (
        follower_id: Types.ObjectId,
        followee_id: Types.ObjectId,
    ) => Promise<HydratedDocument<IFollow> | null>

    getFollowersAndFollowees: (user_id: Types.ObjectId) => Promise<{
        followers: HydratedDocument<IFollow>[] | [],
        followings: HydratedDocument<IFollow>[] | [],
        followersCount: number,
        followingsCount: number
    }>

    removeFollower: (
        follower_id: Types.ObjectId,
        loggedInUserId: Types.ObjectId
    ) => Promise<HydratedDocument<IFollow> | null>;

    getFollowers: (followee_id: Types.ObjectId, page: number) =>  Promise<HydratedDocument<IFollow>[]>

    getFollowings: (followee_id: Types.ObjectId, page: number) =>  Promise<HydratedDocument<IFollow>[]>
}