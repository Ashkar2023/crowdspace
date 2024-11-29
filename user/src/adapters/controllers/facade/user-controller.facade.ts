import { Request } from "express";
import { IUserControllerFacade } from "../interfaces/ifacade/user-controller-facade.interface.js";
import { IProfileController } from "../interfaces/profile-controller.interface.js";
import { ProfileController } from "../user-controllers/profile.controller.js";
import { IProfileInteractorFacade } from "@interactors/interfaces/ifacade/profile-interactor.facade.interface.js";

export class UserControllerFacade implements IUserControllerFacade {
    private _ProfileControllerInstance : IProfileController;

    constructor(
        private _ProfileInteractorFacade : IProfileInteractorFacade 
    ){
        this._ProfileControllerInstance = new ProfileController(_ProfileInteractorFacade);
    }
    
    async getUserProfile(req: Request){
        return await this._ProfileControllerInstance.getUserProfile(req);
    }
}