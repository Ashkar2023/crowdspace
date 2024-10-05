import { IResponse } from "@crowdspace/common";
import { Request } from "express";
import { IUserRegistrationUsecase } from "../user/registration-usecase.interface.js";
import { IOtpUsecase } from "../user/otp-usecase.interface.js";
import { IUserAuthenticationUsecase } from "../user/authentication-usecase.interface.js";

export interface IAuthFacade 
extends 
IOtpUsecase,
IUserAuthenticationUsecase,
IUserRegistrationUsecase {}