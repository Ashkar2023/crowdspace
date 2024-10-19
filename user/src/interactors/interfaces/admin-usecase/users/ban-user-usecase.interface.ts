import { IUser } from "@entities/interfaces/user-entity.interface.js";

export interface IAdminBanUser {
    banUser:(userId: string)=> Promise<IUser | null>
}