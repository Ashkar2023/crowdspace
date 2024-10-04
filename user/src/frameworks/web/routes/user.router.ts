import { IAuthContoller } from "@adapters/controllers/interfaces/auth-controller.interface.js";
import { IUserController } from "@adapters/controllers/interfaces/user-controller.interface.js";
import { createCallback } from "@crowdspace/common";
import { Router, RequestHandler } from "express";

export function buildUserRoutes({ router, userController, middlewares }: { // parameter is an object and names should match
    router: Router,
    userController: IUserController,
    middlewares:Record<string, RequestHandler>
}) {

    //register user - TODO validate req.body with a middleware by Zod
    router.post("/check-username", createCallback(userController.checkUsernameExists.bind(userController)));


    return router
}