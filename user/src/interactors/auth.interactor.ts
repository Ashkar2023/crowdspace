import { IUser } from "@entities/interfaces/user-entity.interface.js";
import { IUserRepository } from "@interactors/interfaces/user-repository.interface.js";
import { UserEntity } from "@entities/user.entity.js";
import { IAuthUsecases } from "@interactors/interfaces/interactor.interface.js";
import { IHashService } from "./interfaces/hash.interface.js";


export class AuthInteractorImp implements IAuthUsecases {
    private repository: IUserRepository;
    private hashService: IHashService;

    constructor(
        repository: IUserRepository,
        hashService: IHashService
    ) {
        this.repository = repository;
        this.hashService = hashService;
    }

    
    async registerUser(user: IUser) {
        const hashedPassword = await this.hashService.hashPassword(user.password);

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
        } = await this.repository.createUser(userData);

        return { email, username, isVerified, displayname, configuration }
    }


    async checkExistingUser(email: string) {
        return (await this.repository.findUser(email)) ? true : false;
    }
}