import { ISearchUsecase } from "../user-usecase/user/search-usecase.interface.js";
import { IUserFollowUsecase } from "../user-usecase/user/userFollow-usecase.interface.js";
import { IUserProfileUsecase } from "../user-usecase/user/userProfile-usecase.interface.js";

export interface IUserInteractorFacade extends
    IUserProfileUsecase,
    IUserFollowUsecase,
    ISearchUsecase { }