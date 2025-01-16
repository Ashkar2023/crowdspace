import { BadRequestError, ConflictError } from "@cr0wdspace/common";
import { RedisService } from "@frameworks/services/redis.service.js";
import { IAdminUnbanUser } from "@interactors/interfaces/admin-usecase/users/unban-user-usecase.interface.js";
import { IAdminUsersRepository } from "@interactors/interfaces/repositories/admin-user-repository.interface.js";

export class AdminUnbanUserImp implements IAdminUnbanUser {

    constructor(
        private AdminUsersRepo: IAdminUsersRepository
    ) {

    }

    async unbanUser(userId: string) {

        const user = await this.AdminUsersRepo.findUserById(userId);

        if (!user) {
            throw new BadRequestError("The user is not found");
        }

        if (!user.isBanned) {
            throw new ConflictError("The user is currently active and not banned");
        }

        // 👇 Anti pattern FIX
        const redisClient = RedisService.getInstance().getClient();
        console.log("unbanned",user.id)
        const addedToSet = await redisClient.SREM("bannedUsers", user.id);

        return await this.AdminUsersRepo.unbanUser(userId);
    }
}