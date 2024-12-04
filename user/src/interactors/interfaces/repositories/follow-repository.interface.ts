import { IFollow } from "@entities/interfaces/follow.interface.js";
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

    findConnection: (
        follower_id: Types.ObjectId,
        followee_id: Types.ObjectId,
    ) => Promise<{
        outgoingFollow: HydratedDocument<IFollow> | null,
        incomingFollow: HydratedDocument<IFollow> | null
    }>

    followExists: (
        follower_id: Types.ObjectId,
        followee_id: Types.ObjectId,
    ) => Promise<HydratedDocument<IFollow> | null>

    getFollowersAndFollowees: (user_id: Types.ObjectId) => Promise<{
        followers: HydratedDocument<IFollow>[] | [],
        followings: HydratedDocument<IFollow>[] | [],
        followersCount:number,
        followingsCount:number
    }>
}