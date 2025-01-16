import { IResponse } from "@cr0wdspace/common";
import { Request } from "express";


export interface IOAuthController{ //use Open/Closed Principle if possible to include other vendors
    googleAuthSignup : (req: Request)=> Promise<IResponse>
}
