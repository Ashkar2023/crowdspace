import { ITokenUsecase } from "../auth/token-usecase.interface.js";
import { IPasswordUpdateUsecase } from "../settings/password-update-usecase.interface.js";
import { IProfileUpdateUsecase } from "../settings/profile-update-usecase.interface.js";

export interface ISettingsInteractorFacade 
extends IProfileUpdateUsecase,IPasswordUpdateUsecase,ITokenUsecase{}