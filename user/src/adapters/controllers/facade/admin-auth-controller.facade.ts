import { Request } from "express";
import { IAdminAuthControllerFacade } from "../interfaces/ifacade/admin-auth-controller-facade.interface.js";
import { IAdminAuthController } from "../interfaces/admin-auth-controller.interface.js";
import { AdminAuthController } from "../admin-controllers/admin-auth.controller.js";
import { IUserAuthController } from "../interfaces/userAuth-controller.interface.js";

export class AdminAuthControllerFacade implements IAdminAuthControllerFacade {
    private AdminAuthControllerInstance: IAdminAuthController;

    constructor(
        UserAuthControllerInstance: IAdminAuthController
    ) {
        this.AdminAuthControllerInstance = new AdminAuthController(UserAuthControllerInstance);
    }

    async loginUser(req: Request) {
        return this.AdminAuthControllerInstance.loginUser(req);
    }

    async logoutUser(req: Request) {
        return this.AdminAuthControllerInstance.logoutUser(req);
    }

    async refreshAccess(req: Request) {
        return this.AdminAuthControllerInstance.refreshAccess(req);
    }
}