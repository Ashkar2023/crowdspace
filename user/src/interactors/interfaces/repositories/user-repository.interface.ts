import { HydratedDocument, UpdateWriteOpResult } from "mongoose";
import { IUser } from "../../../entities/interfaces/user-entity.interface.js";
import { ProfileSettingDTO } from "../settings/profile-update-usecase.interface.js";

export type credentialType = "email" | "username";

export interface IUserRepository {
    insertUser: (user: IUser) => Promise<IUser>,
    findUser: (credential: string, type: credentialType, select?: string) => Promise<HydratedDocument<IUser> | null>
    verifyUser: (email: string) => Promise<HydratedDocument<IUser> | null>;
    findUserById: (userId: string, select?: string) => Promise<HydratedDocument<IUser> | null>;
    updateProfileDetails: (details: ProfileSettingDTO) => Promise<ProfileSettingDTO>;
    updatePassword: (email: string, password: string) => Promise<UpdateWriteOpResult | null>;
    updateUsername: (userId: string, username: string) => Promise<UpdateWriteOpResult | null>;
}