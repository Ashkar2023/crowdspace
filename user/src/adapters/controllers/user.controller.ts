import { IUserUsecases } from "@interactors/interfaces/interactor.interface.js";
import { IUserController } from "./interfaces/controller.interface.js";
import { BadRequestError, ConflictError, IResponse, ResponseCreator, validate, validateReqBody } from "@crowdspace/common";
import { Request } from "express";

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