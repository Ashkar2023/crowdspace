import { IAdminGetUsersUsecase } from "@interactors/interfaces/admin-usecase/users/get-users-usecase.interface.js";
import { IAdminUsersRepository } from "@interactors/interfaces/repositories/admin-user-repository.interface.js";

export class AdminGetUsersImp implements IAdminGetUsersUsecase{
    constructor(
        private AdminUsersRepository : IAdminUsersRepository,
    ){

    }

    async fetchUsers(){
        // filters to be added - for pagination
        
        const result = await this.AdminUsersRepository.getUsers();

        return result;
    }
}