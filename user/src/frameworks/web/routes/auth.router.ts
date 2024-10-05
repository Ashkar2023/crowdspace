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

    // register user
    /* TODO validate req.body with a middleware by zod */
    router.post("/register", createCallback(authContoller.registerUser.bind(authContoller)));

    //login user
    router.post("/login", createCallback(authContoller.loginUser.bind(authContoller)))

    //OAuth routes
    router.post("/oauth-callback", createCallback(authContoller.googleAuthSignup.bind(authContoller)));

    
    router.post("/gen-otp", createCallback(authContoller.generateAndSendOtp.bind(authContoller)));
    router.post("/verify-otp", createCallback(authContoller.verifyAccount.bind(authContoller)));


    router.get("/logout",
        [middlewares.verifyAccessToken],createCallback(authContoller.logoutUser.bind(authContoller)));

    router.get("/refresh-token",
        [middlewares.verifyRefreshToken],
        createCallback(authContoller.refreshAccess.bind(authContoller)));

    return router
}