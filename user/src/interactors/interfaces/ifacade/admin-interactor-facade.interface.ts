import { IAdminBanUser } from "../admin-usecase/users/ban-user-usecase.interface.js";
import { IAdminGetUsersUsecase } from "../admin-usecase/users/get-users-usecase.interface.js";
import { IAdminUnbanUser } from "../admin-usecase/users/unban-user-usecase.interface.js";

export interface IAdminUserInteractorFacade extends
    IAdminGetUsersUsecase,
    IAdminBanUser,
    IAdminUnbanUser { }