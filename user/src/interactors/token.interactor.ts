import { decode } from "@crowdspace/common";
import { ITokenUsecase } from "./interfaces/auth/token-usecase.interface.js";

export class TokenImp implements ITokenUsecase{

    constructor(){
        //make the jwt package a service and handle
    }

    decodeToken(jwt: string){
        return decode(jwt)
    }
}