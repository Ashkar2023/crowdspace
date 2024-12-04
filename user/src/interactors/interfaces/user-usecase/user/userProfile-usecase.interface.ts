import { HydratedDocument } from "mongoose";
import { IUser } from "@entities/interfaces/user-entity.interface.js";
import { IFollow } from "@entities/interfaces/follow.interface.js";

export interface IUserProfileUsecase {
    getUserProfile: (username: string, loggedInUserId: string) =>
        Promise<{
            profile: HydratedDocument<IUser>,
            outgoingFollow: HydratedDocument<IFollow> | null,
            incomingFollow: HydratedDocument<IFollow> | null
        }>
}