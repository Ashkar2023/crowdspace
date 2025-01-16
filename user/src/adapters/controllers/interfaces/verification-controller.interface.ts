import { IResponse } from "@cr0wdspace/common";
import { Request } from "express";

export interface IVerificationController { 
    generateAndSendOtp: (req: Request)=> Promise<IResponse>
    verifyAccount : (req:Request)=> Promise<IResponse>
}