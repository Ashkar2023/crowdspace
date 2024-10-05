import { generateOTP, BadRequestError } from "@crowdspace/common";
import { OTPEntity } from "@entities/otp.entity.js";
import { IOtpUsecase } from "./interfaces/user/otp-usecase.interface.js";
import { IHashService } from "./interfaces/services/hash-service.interface.js";
import { IUserRepository } from "./interfaces/repositories/user-repository.interface.js";
import { IOtpRepository } from "./interfaces/repositories/otp-repository.interface.js";
import { IMailService } from "./interfaces/services/mailer-service.interface.js";

export class OtpImp implements IOtpUsecase {
    private OtpRepository: IOtpRepository;
    private MailService: IMailService
    private UserRepository : IUserRepository
    
    constructor(
        otpRepository: IOtpRepository,
        userRepository : IUserRepository,
        mailService: IMailService,
    ) {
        this.OtpRepository = otpRepository;
        this.MailService = mailService;
        this.UserRepository = userRepository;
    }


    async genAndSendOtpMail(email: string) {
        /* Make it the entity pattern */
        const newOTP = await generateOTP();

        const otpEntity = new OTPEntity(newOTP, email, new Date(Date.now() + 180 * 1000));

        const newOtpDoc = await this.OtpRepository.insertOtpDoc(otpEntity);

        const sentMail = await this.MailService.sendMail(email, newOTP); // decide on newOtpDoc.otp or this way

        return {
            expiration: newOtpDoc.expiration
        }
    }

    async verifyOtp(email: string, otp: string) {
        /* Make it the entity pattern */
        const otpDoc = await this.OtpRepository.getOtpDoc(email);

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

}