import { Request } from "express";
import { IUserControllerFacade } from "../interfaces/ifacade/user-controller-facade.interface.js";
import { IUserController } from "../interfaces/user-controller.interface.js";
import { UserController } from "../user-controllers/user.controller.js";
import { IUserInteractorFacade } from "@interactors/interfaces/ifacade/user-interactor.facade.interface.js";
import { IResponse } from "@crowdspace/common";

export class UserControllerFacade implements IUserControllerFacade {
    private _UserControllerInstance: IUserController;

    constructor(
        private _UserInteractorFacade: IUserInteractorFacade,
    ) {
        this._UserControllerInstance = new UserController(_UserInteractorFacade);
    }

    async getUserProfile(req: Request) {
        return await this._UserControllerInstance.getUserProfile(req);
    }

    async followUser(req: Request) {
        return await this._UserControllerInstance.followUser(req);
    }

    async unfollowUser(req: Request) {
        return await this._UserControllerInstance.unfollowUser(req);
    }

    async getFollows(req: Request) {
        return await this._UserControllerInstance.getFollows(req);
    }
}