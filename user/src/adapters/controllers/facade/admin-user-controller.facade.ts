import { Request } from "express";
import { IAdminUserControllerFacade } from "../interfaces/ifacade/admin-user-controller-facade.interface.js";
import { IAdminUserController } from "../interfaces/admin-user-controller.interface.js";
import { AdminUserController } from "../admin-controllers/admin-user-controller.js";
import { IAdminUserInteractorFacade } from "@interactors/interfaces/ifacade/admin-interactor-facade.interface.js";

export class AdminUserControllerFacade implements IAdminUserControllerFacade {
    private AdminUserControllerInstance: IAdminUserController;

    constructor(
        AdminUserInteractorFacadeInstance: IAdminUserInteractorFacade
    ) {
        this.AdminUserControllerInstance = new AdminUserController(AdminUserInteractorFacadeInstance)
    }

    async getUsers(req: Request) {
        return this.AdminUserControllerInstance.getUsers(req)
    }

    async banUser(req: Request){
        return this.AdminUserControllerInstance.banUser(req);
    }

    async unbanUser(req: Request){
        return this.AdminUserControllerInstance.unbanUser(req);
    }
}