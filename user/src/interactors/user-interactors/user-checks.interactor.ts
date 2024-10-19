import { IUserChecksUsecase } from "../interfaces/user-usecase/auth/user-checks-usecase.interface.js";
import { IUserRepository } from "../interfaces/repositories/user-repository.interface.js";

export class UserChecksImp implements IUserChecksUsecase{

    constructor(
        private _UserRepository : IUserRepository,
    ){}

    async checkExistingUser(email: string) {
        return (await this._UserRepository.findUser(email, "email")) ? true : false;
    }

    async usernameExists(username:string){
        const result = await this._UserRepository.findUser(username,"username");
        return result? true : false;
    }
}