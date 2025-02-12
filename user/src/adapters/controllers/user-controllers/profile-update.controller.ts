import { ISettingsInteractorFacade } from "@interactors/interfaces/ifacade/settings-interactor-facade.interface.js";
import { IProfileUpdateController } from "../interfaces/profile-update-controller.interface.js";
import { IResponse, ResponseCreator } from "@cr0wdspace/common";
import { Request } from "express";
import { IValidationService } from "../interfaces/service/validation-service.interface.js";
import z from "zod";

export class ProfileUpdateController implements IProfileUpdateController {
    constructor(
        private _SettingsInteractorFacade: ISettingsInteractorFacade,
        private _ValidationService: IValidationService
    ) { }

    async updateProfile(req: Request) {

        const { username, bio, links, gender } = req.body;
        const { ajwt } = req.cookies;

        const decoded = this._SettingsInteractorFacade.decodeToken(ajwt);

        /* ZOD validation here */

        const updated = await this._SettingsInteractorFacade.updateProfile({
            username,
            bio,
            links,
            gender,
        },
            decoded.sub
        )

        const response = new ResponseCreator();
        return response.setStatusCode(200)
            .setMessage("Profile Udpated")
            .setData(updated)
            .get()
    }

    async updateUsername(req: Request) {
        const username = req.body.username as string;
        const { ajwt } = req.cookies;

        const decoded = this._SettingsInteractorFacade.decodeToken(ajwt);

        /* ZOD validation here */

        const updatedUsername = await this._SettingsInteractorFacade.updateUsername(
            username.toLowerCase(),
            decoded.sub
        );

        const response = new ResponseCreator();
        return response.setStatusCode(200)
            .setMessage("Username updated")
            .setData({ username: updatedUsername })
            .get()
    };


    async updatePrivacy(req: Request): Promise<IResponse> {
        const { state } = req.body as { state: boolean };
        const loggedInUser = req.headers["x-logged-in-user"] as string;

        this._ValidationService.validate(state, z.boolean({
            coerce:false,
            invalid_type_error: "privacy state must be true/false",
            required_error: "privacy state is required"
        }))

        const isPrivate = await this._SettingsInteractorFacade.updatePrivacy(state, loggedInUser);

        const response = new ResponseCreator();
        return response.setStatusCode(200)
            .setMessage("account privacy status updated")
            .setData({ privateAccount: isPrivate })
            .get();
    }
}