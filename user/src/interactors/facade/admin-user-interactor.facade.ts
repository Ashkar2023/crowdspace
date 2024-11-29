import { AdminBanUserImp } from "@interactors/admin-interactors/users/ban-user.interactor.js";
import { AdminGetUsersImp } from "@interactors/admin-interactors/users/get-users.interactor.js";
import { AdminUnbanUserImp } from "@interactors/admin-interactors/users/unban-user.interactor.js";
import { IAdminBanUser } from "@interactors/interfaces/admin-usecase/users/ban-user-usecase.interface.js";
import { IAdminGetUsersUsecase } from "@interactors/interfaces/admin-usecase/users/get-users-usecase.interface.js";
import { IAdminUnbanUser } from "@interactors/interfaces/admin-usecase/users/unban-user-usecase.interface.js";
import { IAdminUserInteractorFacade } from "@interactors/interfaces/ifacade/admin-interactor-facade.interface.js";
import { IAdminUsersRepository } from "@interactors/interfaces/repositories/admin-user-repository.interface.js";

export class AdminUserInteractorFacade implements IAdminUserInteractorFacade{
    private AdminGetUsersInteractorInstance : IAdminGetUsersUsecase;
    private AdminBanUserInteractorInstance : IAdminBanUser;
    private AdminUnbanUserInteractorInstance : IAdminUnbanUser;

    constructor(
        AdminUsersRepo: IAdminUsersRepository, 
    ){
        this.AdminGetUsersInteractorInstance = new AdminGetUsersImp(AdminUsersRepo);
        this.AdminBanUserInteractorInstance = new AdminBanUserImp(AdminUsersRepo)
        this.AdminUnbanUserInteractorInstance = new AdminUnbanUserImp(AdminUsersRepo)
    }

    async fetchUsers(page:number, limit:number){
        return await this.AdminGetUsersInteractorInstance.fetchUsers(page, limit);
    }

    async banUser(userId: string){
        return await this.AdminBanUserInteractorInstance.banUser(userId);
    }

    async unbanUser(userId: string){
        return await this.AdminUnbanUserInteractorInstance.unbanUser(userId);
    }

}