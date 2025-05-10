import { generateOTP, BadRequestError } from "@cr0wdspace/common";
import { OTPEntity } from "@entities/otp.entity.js";
import { IOtpUsecase } from "../interfaces/user-usecase/auth/otp-usecase.interface.js";
import { IUserRepository } from "../interfaces/repositories/user-repository.interface.js";
import { IOtpRepository } from "../interfaces/repositories/otp-repository.interface.js";
import { IMailService } from "../interfaces/services/mailer-service.interface.js";

export class OtpImp implements IOtpUsecase {
    
    constructor(
        private _OtpRepository: IOtpRepository,
        private _UserRepository : IUserRepository,
        private _MailService: IMailService
    ) {

    }


    async genOtpAndSendMail(email: string) {
        /* Make it the entity pattern */
        const newOTP = await generateOTP();

        const otpEntity = new OTPEntity(newOTP, email, new Date(Date.now() + 180 * 1000));

        const newOtpDoc = await this._OtpRepository.insertOtpDoc(otpEntity);

        const sentMail = await this._MailService.sendMail(email, newOTP, "OTP", "OTP for Account Verification"); // decide on newOtpDoc.otp or this way

        return {
            expiration: newOtpDoc.expiration
        }
    }

    async verifyOtp(email: string, otp: string) {
        /* Make it the entity pattern */
        const otpDoc = await this._OtpRepository.getOtpDoc(email);

        if (!otpDoc) {
            throw new BadRequestError("Invalid Otp");
        } else if ((otpDoc?.expiration as Date) < new Date()) {
            throw new BadRequestError("OTP has expired");
        }

        if (otpDoc?.otp === otp) {
            const updatedUser = await this._UserRepository.verifyUser(email);
            
            if (updatedUser === null) throw new BadRequestError("User not found");
            
            const deleteOtpDoc = await this._OtpRepository.deleteOtpDoc(email);

            return updatedUser

        } else {
            return false
        }

    };

}