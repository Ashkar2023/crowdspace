import { IResponse } from "@crowdspace/common";
import { Request } from "express";

export interface IProfileController {
    updateProfile: (req: Request) => Promise<IResponse>
    updateUsername: (req:Request) => Promise<IResponse>;
} 