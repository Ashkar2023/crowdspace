import { ISettingsInteractorFacade } from "@interactors/interfaces/ifacade/settings-interactor-facade.interface.js";
import { IProfileController } from "./interfaces/profile-controller.interface.js";
import { ResponseCreator } from "@crowdspace/common";
import { Request } from "express";

export class ProfileController implements IProfileController {
    constructor(
        private SettingsInteractorFacade: ISettingsInteractorFacade
    ) { }

    async updateProfile(req: Request) {

        const { username, bio, links, gender } = req.body;
        const { ajwt } = req.cookies;

        const decoded = this.SettingsInteractorFacade.decodeToken(ajwt);

        /* ZOD validation here */

        const updated = await this.SettingsInteractorFacade.updateProfile({
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

        const decoded = this.SettingsInteractorFacade.decodeToken(ajwt);

        /* ZOD validation here */

        const updatedUsername = await this.SettingsInteractorFacade.updateUsername(
            username.toLowerCase(),
            decoded.sub
        );

        const response = new ResponseCreator();
        return response.setStatusCode(200)
            .setMessage("Username updated")
            .setData({ username: updatedUsername })
            .get()
    };

}