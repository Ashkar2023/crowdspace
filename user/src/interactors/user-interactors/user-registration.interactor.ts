import { IUser } from "@entities/interfaces/user-entity.interface.js";
import { IUserRegistrationUsecase } from "../interfaces/user-usecase/auth/registration-usecase.interface.js";
import { UserEntity } from "@entities/user.entity.js";
import { IUserRepository } from "../interfaces/repositories/user-repository.interface.js";
import { IHashService } from "../interfaces/services/hash-service.interface.js";


export class UserRegistrationImp implements IUserRegistrationUsecase{
    
    constructor(
        private _UserRepository:IUserRepository,
        private _HashService: IHashService,
    ){
       
    }

    async registerUser(user: IUser) {

        const hashedPassword = await this._HashService.hashPassword(user.password);

        const userEntity = new UserEntity({
            ...user,
            password: hashedPassword
        });
        const userData = userEntity.get();

        const {
            email,
            username,
            isVerified,
            displayname,
            configuration
        } = await this._UserRepository.insertUser(userData);

        return { email, username, isVerified, displayname, configuration }
    }

}