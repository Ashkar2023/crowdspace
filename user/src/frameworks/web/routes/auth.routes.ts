import { RequestHandler, Router } from "express";
import { createCallback } from "@crowdspace/common";
import { IAuthControllerFacade } from "@adapters/controllers/interfaces/ifacade/auth-controller-facade.interface.js";


/**  @param {Object} params - The parameters should be an Object  */

export function buildAuthRoutes({ router, authContoller, middlewares }: {
    router: Router,
    authContoller: IAuthControllerFacade,
    middlewares: Record<string, RequestHandler>
}) {

    router.post("/check-username", createCallback(authContoller.checkUsernameExists.bind(authContoller)));

    router.post("/register", createCallback(authContoller.registerUser.bind(authContoller)));

    router.post("/login", createCallback(authContoller.loginUser.bind(authContoller)))

    router.post("/oauth-callback", createCallback(authContoller.googleAuthSignup.bind(authContoller)));

    router.post("/gen-otp", createCallback(authContoller.generateAndSendOtp.bind(authContoller)));

    router.post("/verify-otp", createCallback(authContoller.verifyAccount.bind(authContoller)));

    router.get("/logout",
        [middlewares.verifyAccessToken],createCallback(authContoller.logoutUser.bind(authContoller)));

    router.get("/token-refresh",
        [middlewares.verifyRefreshToken],
        createCallback(authContoller.refreshAccess.bind(authContoller)));

        
    /* // router.patch("/forgot-pwd") */

    return router
}