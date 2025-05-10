import { Request } from "express";
import { IUserControllerFacade } from "../interfaces/ifacade/user-controller-facade.interface.js";
import { IUserController } from "../interfaces/user-controller.interface.js";
import { UserController } from "../user-controllers/user.controller.js";
import { IUserInteractorFacade } from "@interactors/interfaces/ifacade/user-interactor.facade.interface.js";
import { IResponse } from "@cr0wdspace/common";

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
    
    async getUserBasicProfile(req: Request){
        return await this._UserControllerInstance.getUserBasicProfile(req);
    };

    async getMultipleUsersBasicProfile(req: Request){
        return await this._UserControllerInstance.getMultipleUsersBasicProfile(req);
    };

    async followUser(req: Request) {
        return await this._UserControllerInstance.followUser(req);
    }

    async unfollowUser(req: Request) {
        return await this._UserControllerInstance.unfollowUser(req);
    }
    
    async acceptFollowRequest(req: Request){
        return await this._UserControllerInstance.acceptFollowRequest(req);
    };

    async search(req:Request){
        return await this._UserControllerInstance.search(req);
    }
    
    async removeFollower(req: Request){
        return await this._UserControllerInstance.removeFollower(req);
    }
    
    async getFollowers(req: Request){
        return await this._UserControllerInstance.getFollowers(req)
    };

    async getFollowings(req: Request){
        return await this._UserControllerInstance.getFollowings(req);
    }

    async getAccountStatusAndConnection(req: Request){
        return await this._UserControllerInstance.getAccountStatusAndConnection(req);
    }
}