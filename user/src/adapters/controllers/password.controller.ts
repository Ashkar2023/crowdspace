import { ResponseCreator } from "@crowdspace/common";
import { Request } from "express";
import { IPasswordController } from "./interfaces/password-controller.interface.js";
import { ISettingsInteractorFacade } from "@interactors/interfaces/ifacade/settings-interactor-facade.interface.js";

export class PasswordController implements IPasswordController {

    constructor(
        private SettingsInteractorFacade : ISettingsInteractorFacade
    ) {

    }

    async updatePassword(req: Request) {
        const { oldPassword, newPassword } = req.body;
        const ajwt = req.cookies["ajwt"];

        /* ZOD VALIDATION */

        const decodedJwt = this.SettingsInteractorFacade.decodeToken(ajwt);

        const updated = await this.SettingsInteractorFacade
            .updatePassword(
                decodedJwt.sub,
                oldPassword,
                newPassword
            );

        const response = new ResponseCreator();
        return response.setStatusCode(200)
            .setMessage("Password Updated")
            .get();
    }
}