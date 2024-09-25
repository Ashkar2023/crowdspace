import { HydratedDocument } from "mongoose"
import { IUser } from "../../entities/interfaces/user-entity.interface.js"

export interface IUserRepository {
    createUser: (user: IUser) => Promise<IUser>,
    findUser: (credential: string, type: string, select?: string) => Promise<HydratedDocument<IUser> | null>
}