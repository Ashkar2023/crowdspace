import { IUser } from "@entities/interfaces/user-entity.interface.js";

export interface IAdminUnbanUser {
    unbanUser:(userId: string)=> Promise<IUser | null>
}