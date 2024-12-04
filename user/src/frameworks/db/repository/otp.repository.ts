import { IOtp } from "@entities/interfaces/otp-entity.interface.js";
import { IOtpRepository } from "@interactors/interfaces/repositories/otp-repository.interface.js";
import { Model } from "mongoose";
import { expirationDate } from "@crowdspace/common";

export class OtpRepositoryImp implements IOtpRepository {
    private model: Model<IOtp>;

    constructor(otpModel: Model<IOtp>) {
        this.model = otpModel;
    }

    async insertOtpDoc(otp: IOtp) {
        return (await this.model.create({
            email: otp.email,
            otp: otp.otp,
            expiration: expirationDate(3, "minute")
        }));
    }

    async getOtpDoc(email: string) {
        return (await this.model.findOne({ email }).sort({ createdAt: -1 }));
    }

    async deleteOtpDoc(email: string) {
        return await this.model.deleteMany({ email });
    }
}