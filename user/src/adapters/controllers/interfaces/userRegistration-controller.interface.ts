import { IResponse } from "@crowdspace/common";
import { Request } from "express";

export interface IUserRegistrationController{
    registerUser: (req: Request) => Promise<IResponse>
    checkUsernameExists: (req:Request) => Promise<IResponse>   
}