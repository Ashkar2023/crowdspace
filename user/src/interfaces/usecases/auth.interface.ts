import { IUser } from "../entity.interface";


export interface IRegisterUser_UseCase {
    execute : ()=> Promise<IUser>
}

export interface ILoginUser_UseCase {
    execute : ()=> Promise<IUser>
}