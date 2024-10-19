import { BadRequestError, IResponse, ResponseCreator } from "@crowdspace/common";
import { Request } from "express";
import { IAdminUserController } from "../interfaces/admin-user-controller.interface.js";
import { IAdminUserInteractorFacade } from "@interactors/interfaces/ifacade/admin-interactor-facade.interface.js";
import { isValidObjectId } from "mongoose";

export class AdminUserController implements IAdminUserController {

    constructor(
        private AdminUserInteractorFacadeInstance: IAdminUserInteractorFacade
    ) {

    }

    async getUsers(req: Request) {
        // destructure req for filters(pagination)

        const result = await this.AdminUserInteractorFacadeInstance.fetchUsers();

        const response = new ResponseCreator();
        return response.setMessage("Users Fetched")
            .setData(result)
            .get()
    }


    async banUser(req: Request) {
        const { userId } = req.params;

        if (!isValidObjectId(userId)) {
            throw new BadRequestError("User ID not valid");
        }

        const result = await this.AdminUserInteractorFacadeInstance.banUser(userId)

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("User unbanned")
            .get()

    }

    async unbanUser(req: Request) {
        const { userId } = req.params;

        if (!isValidObjectId(userId)) {
            throw new BadRequestError("User ID not valid");
        }

        const result = await this.AdminUserInteractorFacadeInstance.unbanUser(userId);

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("User unbanned")
            .get()
    }

}