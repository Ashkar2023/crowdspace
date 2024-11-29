import { IUser } from "@entities/interfaces/user-entity.interface.js";
import { HydratedDocument } from "mongoose";

export interface IAdminUsersRepository {

    // pagination required
    getUsers(page: number, limit: number): Promise<{ users: HydratedDocument<IUser>[], totalUsers: number }>;

    banUser(userId: string): Promise<IUser | null>;

    unbanUser(userId: string): Promise<IUser | null>;

    findUserById: (userId: string, select?: string) => Promise<HydratedDocument<IUser> | null>;

    // findUserByEmail(email: string): Promise<User | null>;
    // promoteUserToAdmin(userId: string): Promise<User | null>;
    // demoteAdminToUser(userId: string): Promise<User | null>;
}