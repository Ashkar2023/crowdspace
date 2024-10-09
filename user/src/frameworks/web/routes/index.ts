import { Router } from "express";
import { userModel } from "@frameworks/db/models/user.model.js";
import { buildAuthRoutes } from "./auth.routes.js";
import { userRepositoryImp } from "@frameworks/db/repository/user-repository.js";
import { HashServiceImp } from "@frameworks/services/hash.service.js";
import { Mailer } from "@frameworks/services/mail.service.js";
import { OtpModel } from "@frameworks/db/models/otp.model.js";
import { OtpRepositoryImp } from "@frameworks/db/repository/otp-repository.js";
import { verifyAccessToken, verifyRefreshToken } from "../middlewares/token.middlewares.js";
import { AuthInteractorFacade, SettingsInteractorFacade } from "@interactors/index.js";
import { AuthControllerFacade, SettingsControllerFacade } from "@adapters/controllers/index.js";
import { buildSettingsRouter } from "./settings.routes.js";

const router = Router();

//repository
const UserRepositoryInstance = new userRepositoryImp(userModel);
const OtpRepositoryInstance = new OtpRepositoryImp(OtpModel);

//services
const HashServiceInstance = new HashServiceImp();
const MailerServiceInstance = new Mailer();

//interactor Facades
const AuthInteractorInstance = new AuthInteractorFacade(
    UserRepositoryInstance,
    OtpRepositoryInstance,
    HashServiceInstance,
    MailerServiceInstance
);
const SettingsInteractorInstance = new SettingsInteractorFacade(UserRepositoryInstance,HashServiceInstance)

// Controller Facades
const AuthControllerInstance = new AuthControllerFacade(AuthInteractorInstance);
const SettingsControllerInstance = new SettingsControllerFacade(SettingsInteractorInstance)


export const authRouter = buildAuthRoutes({
    router,
    authContoller: AuthControllerInstance,
    middlewares: {
        verifyAccessToken,
        verifyRefreshToken
    }
});

export const settingsRouter = buildSettingsRouter({
    router,
    settingsController: SettingsControllerInstance,
    middlewares: {
        verifyAccessToken
    }
})


// ADMIN
// export const adminAuthRouter = buildAdminAuthRouter({
//     router,
//     adminAuthController: "sd",
//     middlewares:{
//         verifyAccessToken,
//         verifyRefreshToken
//     }
// })