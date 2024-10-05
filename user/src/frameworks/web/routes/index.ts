import { Router } from "express";
import { userModel } from "@frameworks/db/models/user.model.js";
import { buildAuthRoutes } from "./auth.router.js";
import { userRepositoryImp } from "@frameworks/db/repository/user-repository.js";
import { HashServiceImp } from "@frameworks/services/hash.service.js";
import { Mailer } from "@frameworks/services/mail.service.js";
import { OtpModel } from "@frameworks/db/models/otp.model.js";
import { OtpRepositoryImp } from "@frameworks/db/repository/otp-repository.js";
import { verifyAccessToken, verifyRefreshToken } from "../middlewares/token.middlewares.js";
import { AuthInteractorFacade } from "@interactors/index.js";
import { AuthControllerFacade } from "@adapters/controllers/index.js";

const router = Router();

//repository
const UserRepositoryInstance = new userRepositoryImp(userModel);
const OtpRepositoryInstance = new OtpRepositoryImp(OtpModel);

//services
const HashServiceInstance = new HashServiceImp();
const MailerServiceInstance = new Mailer();

//interactor facade
const AuthInteractorInstance = new AuthInteractorFacade(
    UserRepositoryInstance,
    OtpRepositoryInstance,
    HashServiceInstance,
    MailerServiceInstance
);

const AuthControllerInstance = new AuthControllerFacade(AuthInteractorInstance);


export const authRouter = buildAuthRoutes({
    router,
    authContoller: AuthControllerInstance,
    middlewares: {
        verifyAccessToken,
        verifyRefreshToken
    }
});
