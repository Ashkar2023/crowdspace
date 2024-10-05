import { IResponse } from "@crowdspace/common";
import { Request } from "express";


export interface IOAuthController{ //use Open/Closed Principle if possible to include other vendors
    googleAuthSignup : (req: Request)=> Promise<IResponse>
}
