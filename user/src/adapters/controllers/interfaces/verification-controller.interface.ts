import { IResponse } from "@crowdspace/common";
import { Request } from "express";

export interface IVerificationController { 
    generateAndSendOtp: (req: Request)=> Promise<IResponse>
    verifyAccount : (req:Request)=> Promise<IResponse>
}