import { Request, RequestHandler, Response, Router } from "express";
import { IAuthContoller } from "@adapters/controllers/interfaces/auth-controller.interface.js";
import { createCallback } from "@crowdspace/common";


/**  @param {Object} params - The parameters should be an Object  */

export function buildAuthRoutes({ router, authContoller, middlewares }: {
    router: Router,
    authContoller: IAuthContoller,
    middlewares: Record<string, RequestHandler>
}) {

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