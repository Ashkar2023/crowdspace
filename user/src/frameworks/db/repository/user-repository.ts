import { IUser } from "@entities/interfaces/user-entity.interface.js";
import { IUserRepository } from "@interactors/interfaces/user-repository.interface.js";
import { Model } from "mongoose";

export class userRepositoryImp implements IUserRepository {
    private model: Model<IUser>;

    constructor(userModel: Model<IUser>) {
        this.model = userModel;
    }

    async createUser(user:IUser){
        return await this.model.create(user);
    }

    async findUser(email: string){
        return await this.model.findOne({email:email});
    }

    async findUsername(username:string){
        return await this.model.findOne({username:username});
    }
}