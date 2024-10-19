import { IUserRegistrationUsecase } from "../user-usecase/auth/registration-usecase.interface.js";
import { IOtpUsecase } from "../user-usecase/auth/otp-usecase.interface.js";
import { IUserAuthenticationUsecase } from "../user-usecase/auth/authentication-usecase.interface.js";
import { IUserChecksUsecase } from "../user-usecase/auth/user-checks-usecase.interface.js";

export interface IAuthInteractorFacade 
extends 
IOtpUsecase,
IUserAuthenticationUsecase,
IUserRegistrationUsecase,
IUserChecksUsecase
 {}