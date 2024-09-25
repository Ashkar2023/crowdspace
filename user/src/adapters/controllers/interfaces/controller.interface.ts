import { IResponse } from "@crowdspace/common";
import { Request } from "express";


export interface IAuthContoller {
    registerUser: (req: Request) => Promise<IResponse>,
    loginUser : (req:Request)=> Promise<IResponse>,
    // verifyUser : ()=> Promise<IResponse>
}

export interface IUserController {
    checkUsernameExists: (req:Request) => Promise<IResponse>,
}