import { Router } from "express";
import { userModel } from "@frameworks/db/models/user.model.js";
import { buildAuthRoutes } from "./auth.routes.js";
import { UserRepositoryImp } from "@frameworks/db/repository/user-repository.js";
import { HashServiceImp } from "@frameworks/services/hash.service.js";
import { Mailer } from "@frameworks/services/mail.service.js";
import { OtpModel } from "@frameworks/db/models/otp.model.js";
import { OtpRepositoryImp } from "@frameworks/db/repository/otp-repository.js";
import { AuthInteractorFacade, SettingsInteractorFacade } from "@interactors/index.js";
import { AuthControllerFacade, SettingsControllerFacade } from "@adapters/controllers/index.js";
import { buildSettingsRouter } from "./settings.routes.js";
import { buildAdminAuthRouter } from "./admin-auth.routes.js";
import { AdminAuthController } from "@adapters/controllers/admin-controllers/admin-auth.controller.js";
import { buildAdminUserRouter } from "./admin-user.routes.js";
import { AdminUserController } from "@adapters/controllers/admin-controllers/admin-user.controller.js";
import { AdminUserInteractorFacade } from "@interactors/facade/admin-user-interactor.facade.js";
import { AdminUsersRepository } from "@frameworks/db/repository/admin-users-repository.js";
import { ValidationService } from "@frameworks/services/validation.service.js";
import { buildUserRoutes } from "./profile.routes.js";
import { UserControllerFacade } from "@adapters/controllers/facade/user-controller.facade.js";
import { ProfileInteractorFacade } from "@interactors/facade/profile-interactor.facade.js";


//repository
const UserRepositoryInstance = new UserRepositoryImp(userModel);
const AdminUsersRepositoryInstance = new AdminUsersRepository(userModel);
const OtpRepositoryInstance = new OtpRepositoryImp(OtpModel);

//services
const HashServiceInstance = new HashServiceImp();
const MailerServiceInstance = new Mailer();
const ValidationServiceInstance = new ValidationService();

//interactor Facades
const AuthInteractorFacadeInstance = new AuthInteractorFacade(
    UserRepositoryInstance,
    OtpRepositoryInstance,
    HashServiceInstance,
    MailerServiceInstance
);
const SettingsInteractorFacadeInstance = new SettingsInteractorFacade(
    UserRepositoryInstance,
    HashServiceInstance
);

const ProfileInteractorFacadeInstance = new ProfileInteractorFacade(UserRepositoryInstance)

const AdminUserInteractorFacadeInstance = new AdminUserInteractorFacade(AdminUsersRepositoryInstance);


// Controller Facades
const AuthControllerInstance = new AuthControllerFacade(
    AuthInteractorFacadeInstance,
    ValidationServiceInstance
);

const SettingsControllerInstance = new SettingsControllerFacade(SettingsInteractorFacadeInstance);

const UserControllerInstance = new UserControllerFacade(ProfileInteractorFacadeInstance);

const AdminUserControllerInstance = new AdminUserController(AdminUserInteractorFacadeInstance)

const AdminAuthControllerInstance = new AdminAuthController() // controllers are written without interactors. Change logic to interactors 

// USER
export const authRouter = buildAuthRoutes({
    router: Router(),
    authContoller: AuthControllerInstance,
    middlewares: {}
});

export const settingsRouter = buildSettingsRouter({
    router: Router(),
    settingsController: SettingsControllerInstance,
    middlewares: {}
})

export const userRouter = buildUserRoutes({ //rename 
    router: Router(),
    UserController: UserControllerInstance,
    middlewares: {}
})


// ADMIN
export const adminAuthRouter = buildAdminAuthRouter({
    router: Router(),
    adminAuthController: AdminAuthControllerInstance,
    // middlewares are commented out
})

export const adminUserRouter = buildAdminUserRouter({
    router: Router(),
    adminUserController: AdminUserControllerInstance,
    // middlewares are commented out
})
