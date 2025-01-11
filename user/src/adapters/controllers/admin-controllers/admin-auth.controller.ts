import { Request } from "express";
import { IAdminAuthController } from "../interfaces/admin-auth-controller.interface.js";
import { IUserAuthController } from "../interfaces/userAuth-controller.interface.js";

export class AdminAuthController implements IAdminAuthController {

    constructor(
        private _UserAuthController: IUserAuthController, // reusing the user auth controller
    ) { }

    async loginUser(req: Request) {
        return await this._UserAuthController.loginUser(req);
    }

    async logoutUser(req: Request) {
        return await this._UserAuthController.logoutUser(req);
    }

    async refreshAccess(req: Request) {
        return await this._UserAuthController.refreshAccess(req);
    }
}