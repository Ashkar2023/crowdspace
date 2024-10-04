import { UUID } from "node:crypto"

export type IOtp = {
    otp: string,
    email: string,
    expiration: Date,
}