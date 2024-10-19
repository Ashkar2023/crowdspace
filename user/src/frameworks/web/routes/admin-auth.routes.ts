import { IAdminAuthController } from "@adapters/controllers/interfaces/admin-auth-controller.interface.js";
import { createCallback } from "@crowdspace/common";
import { RequestHandler, Router } from "express";


export function buildAdminAuthRouter({
    router,
    adminAuthController,
    // middlewares
}: {
    router: Router,
    adminAuthController: IAdminAuthController,
    // middlewares: Record<string, RequestHandler>
}) {


    router.post("/login",
        createCallback(adminAuthController.authenticateAdmin.bind(adminAuthController))
    );

    router.get("/logout",
        createCallback(adminAuthController.logoutAdmin.bind(adminAuthController))
    );

    return router;
}
