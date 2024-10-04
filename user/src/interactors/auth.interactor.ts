import { IUser } from "@entities/interfaces/user-entity.interface.js";
import { IUserRepository } from "@interactors/interfaces/user-repository.interface.js";
import { UserEntity } from "@entities/user.entity.js";
import { IAuthUsecases, loginData } from "@interactors/interfaces/usecases.interface.js";
import { IHashService } from "./interfaces/hash-service.interface.js";
import { BadRequestError, decode, generateOTP, sign, UnauthorizedError } from "@crowdspace/common";
import { IMailService } from "./interfaces/mailer-service.interface.js";
import { IOtpRepository } from "./interfaces/otp-repository.interface.js";
import { OTPImp } from "@entities/otp.entity.js";


export class AuthInteractorImp implements IAuthUsecases {
    private UserRepository: IUserRepository;
    private otpRepository: IOtpRepository;
    private hashService: IHashService;
    private mailService: IMailService;

    constructor(
        userRepository: IUserRepository,
        otpRepository: IOtpRepository,
        hashService: IHashService,
        mailService: IMailService
    ) {
        this.UserRepository = userRepository;
        this.otpRepository = otpRepository;
        this.hashService = hashService;
        this.mailService = mailService;
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
        } = await this.UserRepository.insertUser(userData);

        return { email, username, isVerified, displayname, configuration }
    }

    async checkExistingUser(email: string) {
        return (await this.UserRepository.findUser(email, "email")) ? true : false;
    }

    async authenticateUser(data: loginData) {
        const { credential, password, type } = data;

        const userFound = await this.UserRepository.findUser(credential, type, "-_id +password");

        if (!userFound) {
            throw new BadRequestError("User not found", 404);
        }

        let comparison = true; // for oauth

        if (password !== "nil") {
            comparison = await this.hashService.comparePassword(password, userFound.password);
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

    async genAndSendOtpMail(email: string) {
        /* Make it the entity pattern */
        const newOTP = await generateOTP();

        const otpEntity = new OTPImp(newOTP, email, new Date(Date.now() + 180 * 1000));

        const newOtpDoc = await this.otpRepository.insertOtpDoc(otpEntity);

        const sentMail = await this.mailService.sendMail(email, newOTP); // decide on newOtpDoc.otp or this way

        return {
            expiration: newOtpDoc.expiration
        }
    }

    async verifyOtp(email: string, otp: string) {
        /* Make it the entity pattern */
        const otpDoc = await this.otpRepository.getOtpDoc(email);

        if (!otpDoc) {
            throw new BadRequestError("Invalid Otp");
        } else if ((otpDoc?.expiration as Date) < new Date()) {
            throw new BadRequestError("OTP has expired");
        }

        if (otpDoc?.otp === otp) {
            const updatedUser = await this.UserRepository.verifyUser(email);

            if (updatedUser === null) throw new BadRequestError("User not found");

            return updatedUser

        } else {
            return false
        }

    };


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