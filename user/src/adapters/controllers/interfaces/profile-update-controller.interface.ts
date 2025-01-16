import { IResponse } from "@cr0wdspace/common";
import { Request } from "express";

export interface IProfileUpdateController {
    updateProfile: (req: Request) => Promise<IResponse>
    updateUsername: (req: Request) => Promise<IResponse>;
} 