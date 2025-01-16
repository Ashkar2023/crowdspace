import { IResponse } from "@cr0wdspace/common";
import { Request } from "express";

export interface IPasswordController {
    updatePassword: (req: Request) => Promise<IResponse>;
}