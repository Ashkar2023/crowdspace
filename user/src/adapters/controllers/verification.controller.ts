import { Request } from "express";
import { IVerificationController } from "./interfaces/verification-controller.interface.js";
import { ResponseCreator, BadRequestError } from "@crowdspace/common";
import { IOtpUsecase } from "@interactors/interfaces/user/otp-usecase.interface.js";
import { IAuthFacade } from "@interactors/interfaces/ifacade/auth-interactor-facade.interface.js";

export class VerificationController implements IVerificationController {

    constructor(
        private AuthFacade : IAuthFacade
    ){
    }

    async generateAndSendOtp(req: Request) {
        const { email } = req.body;

        const sent = await this.AuthFacade.genAndSendOtpMail(email);

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("New OTP sent via email")
            .get();
    }

    async verifyAccount(req: Request) {
        const { email, otp } = req.body;

        const updatedUser = await this.AuthFacade.verifyOtp(email, otp);

        if (updatedUser === false) throw new BadRequestError("Incorrect OTP");

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setData(updatedUser.toObject())
            .setMessage("Account verified")
            .get();
    };
}