import { IUserRegistrationUsecase } from "../auth/registration-usecase.interface.js";
import { IOtpUsecase } from "../auth/otp-usecase.interface.js";
import { IUserAuthenticationUsecase } from "../auth/authentication-usecase.interface.js";
import { IUserChecksUsecase } from "../auth/user-checks-usecase.interface.js";

export interface IAuthInteractorFacade 
extends 
IOtpUsecase,
IUserAuthenticationUsecase,
IUserRegistrationUsecase,
IUserChecksUsecase
 {}