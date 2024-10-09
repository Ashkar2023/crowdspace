import { ISettingsControllerFacade } from "@adapters/controllers/interfaces/ifacade/settings-controller-facade.interface.js";
import { createCallback } from "@crowdspace/common";
import { Router } from "express";

export function buildSettingsRouter({ router, settingsController, middlewares }: {
    router: Router,
    settingsController: ISettingsControllerFacade,
    middlewares: Record<string, any>
}) {

    router.use(middlewares.verifyAccessToken);

    router.patch("/profile",
        createCallback(settingsController.updateProfile.bind(settingsController))
    )

    router.patch("/password",
        createCallback(settingsController.updatePassword.bind(settingsController))
    )
    
    router.patch("/username",
        createCallback(settingsController.updateUsername.bind(settingsController))
    )

    // PATCH /settings/privacy
    // PATCH /settings/notification

    return router;
}