import { IUser } from "../../entities/interfaces/user-entity.interface.js"

export interface IUserRepository {
    createUser: (user: IUser) => Promise<IUser>,
    findUser: (email: string) => Promise<IUser | null>
    findUsername: (username: string) => Promise<IUser | null>
}