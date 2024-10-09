import { IResponse } from "@crowdspace/common";
import { Request } from "express";

export interface IPasswordController {
    updatePassword: (req: Request) => Promise<IResponse>;
}