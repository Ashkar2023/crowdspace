import { IOtp } from "@entities/interfaces/otp-entity.interface.js";
import { HydratedDocument } from "mongoose";

export interface deleteResult {
    deletedCount: number;
}

export interface IOtpRepository {
    insertOtpDoc: (otp: IOtp) => Promise<IOtp>;
    getOtpDoc: (email: string) => Promise<HydratedDocument<IOtp> | null>;
    deleteOtpDoc: (email: string) => Promise<deleteResult>
}