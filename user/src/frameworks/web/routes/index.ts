import { Router } from "express";
import { userModel } from "@frameworks/db/models/user.model.js";
import { buildUserRoutes } from "./user.router.js";
import { buildAuthRoutes } from "./auth.router.js";
import { userRepositoryImp } from "@frameworks/db/repository/user-repository.js";
import { AuthControllerImp } from "@adapters/controllers/auth.controller.js";
import { AuthInteractorImp } from "@interactors/index.js";
import { UserInteractorImp } from "@interactors/user.interactors.js";
import { UserControllerImp } from "@adapters/controllers/user.controller.js";
import { HashServiceImp } from "@frameworks/service/hash.service.js";
import { Mailer } from "@frameworks/service/mail.service.js";
import { OtpModel } from "@frameworks/db/models/otp.model.js";
import { OtpRepositoryImp } from "@frameworks/db/repository/otp-repository.js";
import { verifyAccessToken, verifyRefreshToken } from "../middlewares/token.middlewares.js";

const router = Router();

//repository
const UserRepositoryInstance = new userRepositoryImp(userModel);
const OtpRepositoryInstance = new OtpRepositoryImp(OtpModel);

//services
const HashServiceInstance = new HashServiceImp();
const MailerServiceInstance = new Mailer();

//auth
const AuthInteractorInstance = new AuthInteractorImp(
    UserRepositoryInstance,
    OtpRepositoryInstance,
    HashServiceInstance,
    MailerServiceInstance
);

const AuthControllerInstance = new AuthControllerImp(AuthInteractorInstance);

//user
const UserInteractorInstance = new UserInteractorImp(UserRepositoryInstance);
const UserControllerInstance = new UserControllerImp(UserInteractorInstance);


export const authRouter = buildAuthRoutes({
    router,
    authContoller: AuthControllerInstance,
    middlewares: {
        verifyAccessToken,
        verifyRefreshToken
    }
});

export const userRouter = buildUserRoutes({
    router,
    userController: UserControllerInstance,
    middlewares:{
        verifyAccessToken,
        verifyRefreshToken
    }
})
