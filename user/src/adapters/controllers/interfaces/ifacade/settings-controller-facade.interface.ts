import { IPasswordController } from "../password-controller.interface.js";
import { IProfileUpdateController } from "../profile-update-controller.interface.js";

export interface ISettingsControllerFacade extends
    IProfileUpdateController,
    IPasswordController { }