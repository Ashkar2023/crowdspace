import { IResponse } from "@crowdspace/common";
import { Request } from "express";

export interface IUserAuthController{
    loginUser : (req:Request)=> Promise<IResponse>
    logoutUser : (req:Request)=> Promise<IResponse>
    refreshAccess : (req: Request) => Promise<IResponse>
}