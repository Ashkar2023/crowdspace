import { IUserChecksUsecase } from "./interfaces/auth/user-checks-usecase.interface.js";
import { IUserRepository } from "./interfaces/repositories/user-repository.interface.js";

export class UserChecksImp implements IUserChecksUsecase{

    constructor(
        private UserRepository : IUserRepository,
    ){}

    async checkExistingUser(email: string) {
        return (await this.UserRepository.findUser(email, "email")) ? true : false;
    }

    async usernameExists(username:string){
        const result = await this.UserRepository.findUser(username,"username");
        return result? true : false;
    }
}