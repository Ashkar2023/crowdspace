import { Router } from "express";
import { userModel } from "@frameworks/db/models/user.model.js";
import { buildAuthRoutes } from "./auth.routes.js";
import { UserRepositoryImp } from "@frameworks/db/repository/user.repository.js";
import { HashServiceImp } from "@frameworks/services/hash.service.js";
import { Mailer } from "@frameworks/services/mail.service.js";
import { OtpModel } from "@frameworks/db/models/otp.model.js";
import { OtpRepositoryImp } from "@frameworks/db/repository/otp.repository.js";
import { AuthInteractorFacade, SettingsInteractorFacade } from "@interactors/index.js";
import { AuthControllerFacade, SettingsControllerFacade } from "@adapters/controllers/index.js";
import { buildSettingsRouter } from "./settings.routes.js";
import { buildAdminAuthRouter } from "./admin-auth.routes.js";
// import { AdminAuthController } from "@adapters/controllers/admin-controllers/admin-auth.controller.js";
import { buildAdminUserRouter } from "./admin-user.routes.js";
import { AdminUserController } from "@adapters/controllers/admin-controllers/admin-user.controller.js";
import { AdminUserInteractorFacade } from "@interactors/facade/admin-user-interactor.facade.js";
import { AdminUsersRepository } from "@frameworks/db/repository/admin-users.repository.js";
import { ValidationService } from "@frameworks/services/validation.service.js";
import { buildUserRoutes } from "./user.routes.js";
import { UserControllerFacade } from "@adapters/controllers/facade/user-controller.facade.js";
import { UserInteractorFacade } from "@interactors/facade/user-interactor.facade.js";
import { FollowRepositoryImp } from "@frameworks/db/repository/follow.repository.js";
import { AdminAuthController } from "@adapters/controllers/admin-controllers/admin-auth.controller.js";
import { UserAuthenticationImp } from "@interactors/user-interactors/user-authentication.interactor.js";


//repository
const UserRepositoryInstance = new UserRepositoryImp(userModel);
const AdminUsersRepositoryInstance = new AdminUsersRepository(userModel);
const OtpRepositoryInstance = new OtpRepositoryImp(OtpModel);
const FollowRepositoryInstance = new FollowRepositoryImp();

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

const UserInteractorFacadeInstance = new UserInteractorFacade(UserRepositoryInstance, FollowRepositoryInstance)

const AdminUserInteractorFacadeInstance = new AdminUserInteractorFacade(AdminUsersRepositoryInstance);


// Controller Facades
const AuthControllerFacadeInstance = new AuthControllerFacade(
    AuthInteractorFacadeInstance,
    ValidationServiceInstance
);

const SettingsControllerInstance = new SettingsControllerFacade(SettingsInteractorFacadeInstance);

const UserControllerInstance = new UserControllerFacade(UserInteractorFacadeInstance);

const AdminUserControllerInstance = new AdminUserController(AdminUserInteractorFacadeInstance)

const AdminAuthControllerInstance = new AdminAuthController(AuthControllerFacadeInstance); // given a userAuthInterface implemented facade

// USER
export const authRouter = buildAuthRoutes({
    router: Router(),
    authContoller: AuthControllerFacadeInstance,
    middlewares: {}
});

export const settingsRouter = buildSettingsRouter({
    router: Router(),
    settingsController: SettingsControllerInstance,
    middlewares: {}
})

export const userRouter = buildUserRoutes({
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
