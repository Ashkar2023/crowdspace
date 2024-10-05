import { IOAuthController } from "../oauth-controller.interface.js";
import { IUserAuthController } from "../userAuth-controller.interface.js";
import { IUserRegistrationController } from "../userRegistration-controller.interface.js";
import { IVerificationController } from "../verification-controller.interface.js";

export interface IAuthControllerFacade extends 
IOAuthController,
IUserAuthController,
IUserRegistrationController,
IVerificationController
{}