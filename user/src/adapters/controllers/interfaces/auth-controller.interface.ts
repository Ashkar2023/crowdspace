import { IResponse } from "@crowdspace/common";
import { Request } from "express";


//VIOLATES SRP
export interface IAuthContoller { 
    registerUser: (req: Request) => Promise<IResponse>
    
    loginUser : (req:Request)=> Promise<IResponse>
    logoutUser : (req:Request)=> Promise<IResponse>
    
    googleAuthSignup : (req: Request)=> Promise<IResponse>
    
    generateAndSendOtp: (req: Request)=> Promise<IResponse>
    verifyAccount : (req:Request)=> Promise<IResponse>

    refreshAccess : (req: Request) => Promise<IResponse>
}