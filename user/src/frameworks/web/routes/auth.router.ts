import { Request, RequestHandler, Response, Router } from "express";
import { IAuthContoller } from "@adapters/controllers/interfaces/controller.interface.js";
import { createCallback } from "@crowdspace/common";
import { IHashService } from "@interactors/interfaces/hash.interface.js";



/**  @param {Object} params - The parameters should be an Object  */

export function buildAuthRoutes({ router, authContoller }: { 
    router: Router,
    authContoller: IAuthContoller,
    // middlewares:Record<string, RequestHandler> //TODO - for recieving middlewares
}) {

    //register user - TODO validate req.body with a middleware by Joi/Yup
    router.post("/register", createCallback(authContoller.registerUser.bind(authContoller)));
    
    //test
    router.get("/login", createCallback(authContoller.))


    return router
}