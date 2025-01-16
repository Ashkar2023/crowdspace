import { BadRequestError, decodeJWT, signJWT, TokenError, UnauthorizedError } from "@cr0wdspace/common";
import { IHashService } from "../interfaces/services/hash-service.interface.js";
import { IUserRepository } from "../interfaces/repositories/user-repository.interface.js";
import { IUserAuthenticationUsecase } from "../interfaces/user-usecase/auth/authentication-usecase.interface.js";

export type loginData = {
    credential: string,
    password: string,
    type: "email" | "username"
}

export class UserAuthenticationImp implements IUserAuthenticationUsecase {

    constructor(
        private _UserRepository: IUserRepository,
        private _HashService: IHashService
    ) {

    }

    async authenticateUser(data: loginData) {
        const { credential, password, type } = data;

        const userFound = await this._UserRepository.findUser(credential, type, "+password");

        if (!userFound) {
            throw new BadRequestError("Invalid Credentials", 404);
        }

        if(userFound.isBanned){
            throw new BadRequestError("Account banned",403)
        }

        let comparison = true; // for oauth

        if (password !== "nil") {
            comparison = await this._HashService.comparePassword(password, userFound.password);
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
            TOKEN refresh already moved to AUTH service, change this token generation to a call to auth service  
         */
        /* 
        TIGHT COUPLING, CHANGE to dependency injection
        change the methods from the common package to a service implementation.
        priority : HIGH 
        */
       const accessToken = await signJWT({
           secret: (process.env.TOKEN_SECRET as string),
           payload: {
               iss: process.env.ISSUER as string,
               aud: process.env.AUDIENCE as string,
               sub: userFound._id,
               username: userFound.username,
               type: "ACCESS",
               role: userFound.role
            },
            tokenType: "ACCESS"
        })
        
        const refreshToken = await signJWT({
            secret: (process.env.TOKEN_SECRET as string),
            payload: {
                iss: process.env.ISSUER as string,
                aud: process.env.AUDIENCE as string,
                sub: userFound._id,
                type: "REFRESH",
                role: userFound.role
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
    
    /*
        TOKEN refresh already moved to AUTH service
        No need of this here  
     */
    async refreshAccessToken(cookie: string) {
        const { sub, username, role } = decodeJWT(cookie);
        console.log("refreshAccessToken - role", role)
        // issue 003
        // check for user in database and verify
        // rather than blindly regenerating the access token

        const accessToken = await signJWT({
            secret: (process.env.TOKEN_SECRET as string),
            payload: {
                iss: process.env.ISSUER as string,
                aud: process.env.AUDIENCE as string,
                sub: sub,
                username: username,
                type: "ACCESS",
                role:role // vulnerable fix issue 003
            },
            tokenType: "ACCESS"
        })

        return accessToken
    };

}