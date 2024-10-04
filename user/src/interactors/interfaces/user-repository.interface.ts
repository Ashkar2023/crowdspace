import { HydratedDocument, UpdateWriteOpResult } from "mongoose"
import { IUser } from "../../entities/interfaces/user-entity.interface.js"

export interface IUserRepository {
    insertUser: (user: IUser) => Promise<IUser>,
    findUser: (credential: string, type: string, select?: string) => Promise<HydratedDocument<IUser> | null>
    verifyUser: (email: string) => Promise<HydratedDocument<IUser> | null>
}