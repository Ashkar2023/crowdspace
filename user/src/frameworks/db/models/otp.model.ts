import { IOtp } from '@entities/interfaces/otp-entity.interface.js';
import { Schema, Types, model } from 'mongoose';
import { randomUUID } from 'node:crypto';

const otpSchema = new Schema({ /* Chnage to redis */
    otp: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        index: true,
    },
    expiration: {
        type: Date,
        default: () => { Date.now() + 180 * 1000 },
        expires: 10
    },
    sessionId: {
        type: Types.UUID,
        default: randomUUID
    }
}, {
    timestamps: true,
});

otpSchema.methods.isExpired = function (): boolean {
    return new Date() > this.expiry;
};

export const OtpModel = model<IOtp>('otp', otpSchema, 'otps');
