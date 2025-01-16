import { BadRequestError, ConflictError } from "@cr0wdspace/common";
import { RedisService } from "@frameworks/services/redis.service.js";
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

        // 👇 Anti pattern FIX
        const redisClient = RedisService.getInstance().getClient();
        console.log("Banned",user.id)
        const addedToSet = redisClient.SADD("bannedUsers",user.id)

        return await this.AdminUsersRepo.banUser(userId);
    }
}