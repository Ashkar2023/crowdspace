import { IPasswordController } from "../password-controller.interface.js";
import { IProfileController } from "../profile-controller.interface.js";

export interface ISettingsControllerFacade
    extends IProfileController,IPasswordController{}