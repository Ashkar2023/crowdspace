import { IResponse } from "@crowdspace/common";
import { Request } from "express";

export interface IAdminUserController {
    getUsers: (req: Request) => Promise<IResponse>
    banUser:(req:Request)=>Promise<IResponse>
    unbanUser:(req:Request)=>Promise<IResponse>
}