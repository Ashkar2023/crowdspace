import { IAdminAuthController } from "@adapters/controllers/interfaces/admin-auth-controller.interface.js";
import { createCallback } from "@cr0wdspace/common";
import { RequestHandler, Router } from "express";


export function buildAdminAuthRouter({
    router,
    adminAuthController,
    // middlewares
}: {
    router: Router,
    /**
     * anything that implements the IUserAuthController can be injected,
     * IAdminAuthController is just an extended IUserAuthController 
     */
    adminAuthController: IAdminAuthController,
    // middlewares: Record<string, RequestHandler>
}) {


    router.post("/login",
        createCallback(adminAuthController.loginUser.bind(adminAuthController))
    );

    router.get("/logout",
        createCallback(adminAuthController.logoutUser.bind(adminAuthController))
    );

    router.get("/token-refresh", createCallback(adminAuthController.refreshAccess.bind(adminAuthController)));

    return router;
}
