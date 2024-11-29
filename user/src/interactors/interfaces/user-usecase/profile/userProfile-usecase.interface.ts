import { HydratedDocument } from "mongoose";
import { IUser } from "@entities/interfaces/user-entity.interface.js";

export interface IUserProfileUsecase {
    getUserProfile: (username: string) => Promise<HydratedDocument<IUser> | null>;
}