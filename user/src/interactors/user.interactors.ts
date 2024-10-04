import { IUserUsecases } from "./interfaces/usecases.interface.js";
import { IUserRepository } from "./interfaces/user-repository.interface.js";


export class UserInteractorImp implements IUserUsecases{
    private repository : IUserRepository;

    constructor(repository : IUserRepository){
        this.repository = repository;
    }

    async usernameExists(username:string){
        const result = await this.repository.findUser(username,"username");
        return result? true : false;
    }
}