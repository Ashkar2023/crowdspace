import { IUser } from "@entities/interfaces/user-entity.interface.js";
import { IUserRepository } from "@interactors/interfaces/user-repository.interface.js";
import { Model } from "mongoose";


export class userRepositoryImp implements IUserRepository {
    private model: Model<IUser>;

    constructor(userModel: Model<IUser>) {
        this.model = userModel;
    }

    async createUser(user: IUser) {
        return await this.model.create(user);
    }

    // computed property [type] for reusable code
    async findUser(
        credential: string,
        type: string = "email",
        select: string = "-_id"
    ) {
        return await this.model.findOne({ [type]: credential }).select(select);
    }

}