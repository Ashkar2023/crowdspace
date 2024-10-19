import { ITokenUsecase } from "../user-usecase/auth/token-usecase.interface.js";
import { IPasswordUpdateUsecase } from "../user-usecase/settings/password-update-usecase.interface.js";
import { IProfileUpdateUsecase } from "../user-usecase/settings/profile-update-usecase.interface.js";

export interface ISettingsInteractorFacade 
extends IProfileUpdateUsecase,IPasswordUpdateUsecase,ITokenUsecase{}