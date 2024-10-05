import { UUID } from "crypto";
import { IOtp } from "./interfaces/otp-entity.interface.js";

export class OTPEntity implements IOtp {
    otp: string;
    email: string;
    expiration: Date;

    constructor(otp: string, email: string, expiration:Date) {
        this.otp = otp;
        this.email = email;
        this.expiration = expiration;
    }

    public isExpired(): boolean {
        return new Date() > this.expiration;
    }

    public getOtp(): string {
        return this.otp;
    }

    public getEmail(): string {
        return this.email;
    }

    public getExpiration(): Date {
        return this.expiration;
    }

    public get(): IOtp {
        return this;
    }
}
