import { IResponse } from "@crowdspace/common";
import { Request } from "express";

export interface IUserController {
    checkUsernameExists: (req:Request) => Promise<IResponse>,
}