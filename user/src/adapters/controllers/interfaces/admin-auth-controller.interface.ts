import { IResponse } from "@crowdspace/common";
import { Request } from "express";

export interface IAdminAuthController {
    authenticateAdmin: (req: Request) => Promise<IResponse>
    logoutAdmin: (req: Request) => Promise<IResponse>
}