import { IUserUsecases } from "@interactors/interfaces/usecases.interface.js";
import { ConflictError, ResponseCreator, validateReqBody } from "@crowdspace/common";
import { Request } from "express";
import { IUserController } from "./interfaces/user-controller.interface.js";

export class UserControllerImp implements IUserController {
    private userInteractor: IUserUsecases

    constructor(userInteractor: IUserUsecases) {
        this.userInteractor = userInteractor;
    }

    async checkUsernameExists(req: Request) {

        validateReqBody(req.body, ["username"]); // change to zod validation middleware

        const { username } = req.body;
        const result = await this.userInteractor.usernameExists(username);

        if(result) throw new ConflictError("Username already found");

        const response = new ResponseCreator();

        return response
            .setStatusCode(200)
            .setMessage("Username doesn't exist")
            .get();
    };
}