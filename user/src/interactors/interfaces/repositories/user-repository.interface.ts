import { HydratedDocument, Types, UpdateWriteOpResult } from "mongoose";
import { IUser } from "../../../entities/interfaces/user-entity.interface.js";
import { T_ProfileSetting } from "../user-usecase/settings/profile-update-usecase.interface.js";

export type credentialType = "email" | "username";

export interface IUserRepository {
    insertUser: (user: IUser) => Promise<IUser>,
    findUser: (credential: string, type: credentialType, select?: string) => Promise<HydratedDocument<IUser> | null>
    verifyUser: (email: string) => Promise<HydratedDocument<IUser> | null>;
    findUserById: (userId: string, select?: string) => Promise<HydratedDocument<IUser> | null>;
    updateProfileDetails: (details: T_ProfileSetting) => Promise<T_ProfileSetting>;
    updatePassword: (email: string, password: string) => Promise<UpdateWriteOpResult | null>;
    updateUsername: (userId: string, username: string) => Promise<UpdateWriteOpResult | null>;
    getProfile: (username: string) => Promise<HydratedDocument<IUser> | null>;
    updateFollowersCount: (userId: Types.ObjectId, action: "dec" | "inc") => Promise<UpdateWriteOpResult | null>
    updateFollowingsCount: (userId: Types.ObjectId, action: "dec" | "inc") => Promise<UpdateWriteOpResult | null>
    search: (query: string) => Promise<IUser[] | null>
    findMultipleUsersById: (user_ids: string[], select?: string) => Promise<HydratedDocument<IUser>[]>;
    updateProfileAvatar: (user_id: Types.ObjectId, media_path: string) => Promise<UpdateWriteOpResult | null>;
    getAllBannedUsers: () => Promise<string[]>
    updatePrivacySetting: (user_id: Types.ObjectId, state: boolean) => Promise<{ isPrivate: boolean }>
}