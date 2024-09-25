import { IUser } from "@entities/interfaces/user-entity.interface.js";
import { IUserRepository } from "@interactors/interfaces/user-repository.interface.js";
import { UserEntity } from "@entities/user.entity.js";
import { IAuthUsecases, loginData } from "@interactors/interfaces/interactor.interface.js";
import { IHashService } from "./interfaces/hash.interface.js";
import { BadRequestError, sign, UnauthorizedError } from "@crowdspace/common";


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
        return (await this.repository.findUser(email, "email")) ? true : false;
    }

    async authenticateUser(data: loginData) {
        const { credential, password, type } = data;

        const userFound = await this.repository.findUser(credential, type, "-_id +password");

        if (!userFound) {
            throw new BadRequestError("User not found", 404);
        }

        const comparison = await this.hashService.comparePassword(password, userFound.password);

        if (!comparison) {
            throw new UnauthorizedError("Incorrect credentials");
        }

        const accessToken = await sign({
            secret: (process.env.TOKEN_SECRET as string),
            payload: {
                iss: "crowdspace.user",
                aud: "https://crowdspace.in",
                sub: userFound._id,
                username: userFound.username,
                type: "ACCESS"
            },
            tokenType: "ACCESS"
        })

        const refreshToken = await sign({
            secret: (process.env.TOKEN_SECRET as string),
            payload: {
                iss: "crowdspace.user",
                aud: "https://crowdspace.in",
                sub: userFound._id,
                username: userFound.username,
                type: "REFRESH"
            },
            tokenType: "REFRESH"
        })


        const santizedInput = userFound.toObject();
        
        return {
            user: santizedInput,
            refreshToken,
            accessToken
        };
    }
}