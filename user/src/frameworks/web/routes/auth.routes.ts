import { RequestHandler, Router } from "express";
import { createCallback } from "@cr0wdspace/common";
import { IAuthControllerFacade } from "@adapters/controllers/interfaces/ifacade/auth-controller-facade.interface.js";


/**  @param {Object} params - The parameters should be an Object  */

export function buildAuthRoutes({ router, authContollerFacade, middlewares }: {
    router: Router,
    authContollerFacade: IAuthControllerFacade,
    middlewares: Record<string, RequestHandler>
}) {

    router.post("/check-username", createCallback(authContollerFacade.checkUsernameExists.bind(authContollerFacade)));

    router.post("/register", createCallback(authContollerFacade.registerUser.bind(authContollerFacade)));

    router.post("/login", createCallback(authContollerFacade.loginUser.bind(authContollerFacade)));

    router.post("/oauth-callback", createCallback(authContollerFacade.googleAuthSignup.bind(authContollerFacade)));

    router.post("/gen-otp", createCallback(authContollerFacade.generateAndSendOtp.bind(authContollerFacade)));

    router.post("/verify-otp", createCallback(authContollerFacade.verifyAccount.bind(authContollerFacade)));

    /* Protected Routes */
    router.get("/logout", createCallback(authContollerFacade.logoutUser.bind(authContollerFacade)));

    router.get("/token-refresh", createCallback(authContollerFacade.refreshAccess.bind(authContollerFacade)));

    return router
}