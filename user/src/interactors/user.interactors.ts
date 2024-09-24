import { IUserController } from "@adapters/controllers/interfaces/controller.interface.js";
import { IUserUsecases } from "./interfaces/interactor.interface.js";
import { IUserRepository } from "./interfaces/user-repository.interface.js";


export class UserInteractorImp implements IUserUsecases{
    private repository : IUserRepository;

    constructor(repository : IUserRepository){
        this.repository = repository;
    }

    async usernameExists(username:string){
        const result = await this.repository.findUsername(username);
        return result? true : false;
    }
}