import { Types } from "mongoose";

export enum FollowStatus {
    active = 'active',
    pending = 'pending'
};

export interface IFollow {
    followee_id: Types.ObjectId,
    follower_id: Types.ObjectId,
    status: FollowStatus,
    close_friends: boolean,
}