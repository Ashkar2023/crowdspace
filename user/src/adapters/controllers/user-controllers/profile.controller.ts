import { IProfileInteractorFacade } from "@interactors/interfaces/ifacade/profile-interactor.facade.interface.js";
import { IProfileController } from "../interfaces/profile-controller.interface.js";
import { ResponseCreator } from "@crowdspace/common";
import { Request } from "express";

export class ProfileController implements IProfileController {

    constructor(
        private _ProfileInteractorFacade: IProfileInteractorFacade,
    ) {

    }

    async getUserProfile(req: Request) {
        const username = req.params.username.replace("@", "");

        const profile = await this._ProfileInteractorFacade.getUserProfile(username);

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("profile details fetched")
            .setData({ profile })
            .get();
    };
}