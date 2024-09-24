import { Router } from "express";
import { userModel } from "@frameworks/db/mongo/models/user.model.js";
import { buildUserRoutes } from "./user.router.js";
import { buildAuthRoutes } from "./auth.router.js";
import { userRepositoryImp } from "@frameworks/db/repository/user-repository.js";
import { AuthControllerImp } from "@adapters/controllers/auth.controller.js";
import { AuthInteractorImp } from "@interactors/index.js";
import { UserInteractorImp } from "@interactors/user.interactors.js";
import { UserControllerImp } from "@adapters/controllers/user.controller.js";
import { HashServiceImp } from "@frameworks/service/hash.service.js";

const router = Router();

//repository
const UserRepositoryInstance = new userRepositoryImp(userModel);

//services
const HashServiceInstance = new HashServiceImp();

//auth
const AuthInteractorInstance = new AuthInteractorImp(UserRepositoryInstance, HashServiceInstance);
const AuthControllerInstance = new AuthControllerImp(AuthInteractorInstance);

//user
const UserInteractorInstance = new UserInteractorImp(UserRepositoryInstance);
const UserControllerInstance = new UserControllerImp(UserInteractorInstance);

export const authRouter = buildAuthRoutes({
    router,
    authContoller: AuthControllerInstance, // careful overhere, the parameter is an object
    // middlewares: {

    // }
});

export const userRouter = buildUserRoutes({
    router,
    userController: UserControllerInstance
})
