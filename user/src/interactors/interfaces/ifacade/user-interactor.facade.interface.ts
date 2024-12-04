import { IUserFollowUsecase } from "../user-usecase/user/userFollow-usecase.interface.js";
import { IUserProfileUsecase } from "../user-usecase/user/userProfile-usecase.interface.js";

export interface IUserInteractorFacade extends
    IUserProfileUsecase,
    IUserFollowUsecase { }