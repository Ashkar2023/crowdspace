import { IResponse } from "@cr0wdspace/common";
import { Request } from "express";
import { IUserAuthController } from "./userAuth-controller.interface.js";

export interface IAdminAuthController
    extends IUserAuthController { }


// authenticateAdmin: (req: Request) => Promise<IResponse>
// logoutAdmin: (req: Request) => Promise<IResponse>