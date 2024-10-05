import { BadRequestError, decode, sign, UnauthorizedError } from "@crowdspace/common";
import { IHashService } from "./interfaces/services/hash-service.interface.js";
import { IUserRepository } from "./interfaces/repositories/user-repository.interface.js";
import { IUserAuthenticationUsecase } from "./interfaces/user/authentication-usecase.interface.js";

export type loginData = {
    credential: string,
    password: string,
    type: "email" | "username" | "_id"
}

export class UserAuthenticationImp implements IUserAuthenticationUsecase{
    private UserRepository:IUserRepository;
    private HashService: IHashService

    constructor(
        userRepository:IUserRepository,
        hashService: IHashService
    ){
        this.UserRepository = userRepository; 
        this.HashService = hashService; 
    }

    async authenticateUser(data: loginData) {
        const { credential, password, type } = data;

        const userFound = await this.UserRepository.findUser(credential, type, "-_id +password");

        if (!userFound) {
            throw new BadRequestError("User not found", 404);
        }

        let comparison = true; // for oauth

        if (password !== "nil") {
            comparison = await this.HashService.comparePassword(password, userFound.password);
        }

        if (!comparison) {
            throw new BadRequestError("Incorrect credentials", 400);
        } else if (!userFound.isVerified) {
            throw new UnauthorizedError("Account not verified", 401, {
                email: userFound.email,
                isVerified: userFound.isVerified,
            });
        }

        /* 
            TIGHT COUPLING, CHANGE to dependency injection
            change the methods from the common package to a service implementation.
            priority : HIGH 
        */
        const accessToken = await sign({
            secret: (process.env.TOKEN_SECRET as string),
            payload: {
                iss: process.env.ISSUER as string,
                aud: process.env.AUDIENCE as string,
                sub: userFound._id,
                username: userFound.username,
                type: "ACCESS"
            },
            tokenType: "ACCESS"
        })

        const refreshToken = await sign({
            secret: (process.env.TOKEN_SECRET as string),
            payload: {
                iss: process.env.ISSUER as string,
                aud: process.env.AUDIENCE as string,
                sub: userFound._id,
                username: userFound.username,
                type: "REFRESH"
            },
            tokenType: "REFRESH"
        })


        const santizedUser = userFound.toObject();

        return {
            user: santizedUser,
            refreshToken,
            accessToken
        };
    }

    async refreshAccessToken(cookie: string) {
        const { sub, username } = decode(cookie);

        const accessToken = await sign({
            secret: (process.env.TOKEN_SECRET as string),
            payload: {
                iss: process.env.ISSUER as string,
                aud: process.env.AUDIENCE as string,
                sub: sub,
                username: username,
                type: "ACCESS"
            },
            tokenType: "ACCESS"
        })

        return accessToken
    };

}