import { Request } from "express";
import { IVerificationController } from "./interfaces/verification-controller.interface.js";
import { ResponseCreator, BadRequestError } from "@crowdspace/common";
import { IOtpUsecase } from "@interactors/interfaces/auth/otp-usecase.interface.js";
import { IAuthInteractorFacade } from "@interactors/interfaces/ifacade/auth-interactor-facade.interface.js";

export class VerificationController implements IVerificationController {

    constructor(
        private AuthInteractorFacade : IAuthInteractorFacade
    ){
    }

    async generateAndSendOtp(req: Request) {
        const { email } = req.body;

        const sent = await this.AuthInteractorFacade.genAndSendOtpMail(email);

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("New OTP sent via email")
            .get();
    }

    async verifyAccount(req: Request) {
        const { email, otp } = req.body;

        const updatedUser = await this.AuthInteractorFacade.verifyOtp(email, otp);

        if (updatedUser === false) throw new BadRequestError("Incorrect OTP");

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setData(updatedUser.toObject())
            .setMessage("Account verified")
            .get();
    };
}