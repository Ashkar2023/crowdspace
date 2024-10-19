import { IUser } from "@entities/interfaces/user-entity.interface.js";
import { HydratedDocument } from "mongoose";

export interface IAdminGetUsersUsecase {
    
    fetchUsers: () => Promise<{
        users: HydratedDocument<IUser>[] | null,
        totalUsers: number
    }>

}