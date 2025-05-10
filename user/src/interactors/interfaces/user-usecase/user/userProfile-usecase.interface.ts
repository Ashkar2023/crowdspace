import { HydratedDocument, Types } from "mongoose";
import { IUser } from "@entities/interfaces/user-entity.interface.js";
import { IFollow } from "@entities/interfaces/follow.interface.js";
import { IBasicUser } from "@cr0wdspace/common";

export interface IUserProfileUsecase {
    getUserProfile: (username: string, loggedInUserId: string) =>
        Promise<{
            profile: HydratedDocument<IUser>,
            outgoingFollow: HydratedDocument<IFollow> | null,
            incomingFollow: HydratedDocument<IFollow> | null
        }>

    getAccountStatusAndConnection: (follower: Types.ObjectId, followee: Types.ObjectId) =>
        Promise<{
            privateAccount: boolean,
            outgoingFollow: HydratedDocument<IFollow> | null,
            incomingFollow: HydratedDocument<IFollow> | null
        } & IBasicUser>

    getUserBasicProfile: (userId: string) => Promise<HydratedDocument<IUser> | null>

    getMultipleUsersBasicProfile: (user_ids: string[]) => Promise<HydratedDocument<IUser>[]>
}