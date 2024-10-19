import { BadRequestError, ConflictError } from "@crowdspace/common";
import { IAdminBanUser } from "@interactors/interfaces/admin-usecase/users/ban-user-usecase.interface.js";
import { IAdminUsersRepository } from "@interactors/interfaces/repositories/admin-user-repository.interface.js";

export class AdminBanUserImp implements IAdminBanUser{

    constructor(
        private AdminUsersRepo : IAdminUsersRepository 
    ) {
        
    }

    async banUser(userId:string){

        const user = await this.AdminUsersRepo.findUserById(userId);
        
        if(!user){
            throw new BadRequestError("The user is not found");
        }

        if(user.isBanned){
            throw new ConflictError("The user is already banned");
        } 

        return await this.AdminUsersRepo.banUser(userId);
    }
}