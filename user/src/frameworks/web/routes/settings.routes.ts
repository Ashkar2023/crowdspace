import { ISettingsControllerFacade } from "@adapters/controllers/interfaces/ifacade/settings-controller-facade.interface.js";
import { createCallback } from "@cr0wdspace/common";
import { Router } from "express";

export function buildSettingsRouter({ router, settingsControllerFacade, middlewares }: {
    router: Router,
    settingsControllerFacade: ISettingsControllerFacade,
    middlewares: Record<string, any>
}) {

    router.patch("/profile",
        createCallback(settingsControllerFacade.updateProfile.bind(settingsControllerFacade))
    )

    router.patch("/password",
        createCallback(settingsControllerFacade.updatePassword.bind(settingsControllerFacade))
    )
    
    router.patch("/username",
        createCallback(settingsControllerFacade.updateUsername.bind(settingsControllerFacade))
    )

    router.patch("/privacy", 
        createCallback(settingsControllerFacade.updatePrivacy.bind(settingsControllerFacade))
    )

    router.post("/reset-password", createCallback(settingsControllerFacade.sendPasswordResetLink.bind(settingsControllerFacade)));

    router.patch("/reset-password", createCallback(settingsControllerFacade.resetPassword.bind(settingsControllerFacade)));
    
    // PATCH /settings/notification

    return router;
}