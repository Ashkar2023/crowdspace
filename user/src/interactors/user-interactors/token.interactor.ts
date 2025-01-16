import { decodeJWT } from "@cr0wdspace/common";
import { ITokenUsecase } from "../interfaces/user-usecase/auth/token-usecase.interface.js";

export class TokenImp implements ITokenUsecase{

    constructor(){
        //make the jwt package a service and handle
    }

    decodeToken(jwt: string){
        return decodeJWT(jwt)
    }
}