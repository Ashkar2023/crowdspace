import { Request } from "express";
import { IAdminAuthController } from "../interfaces/admin-auth-controller.interface.js";
import { BadRequestError, IResponse, ResponseCreator } from "@crowdspace/common";
import { promisify } from "node:util";

export class AdminAuthController implements IAdminAuthController {
    constructor(

    ) {

    }

    async authenticateAdmin(req: Request) {
        const { email, password } = req.body;

        if (email === "admin123@gmail.com" && password === "admin123123") {
            req.session.user = email;
        } else {
            throw new BadRequestError("admin not found");
        }

        const response = new ResponseCreator();
        return response.setStatusCode(200).setMessage("Login successfull").get()
    }

    async logoutAdmin(req: Request) {

        const response = new ResponseCreator();

        try {
            await promisify(req.session.destroy).call(req.session);
            return response
                .setStatusCode(200)
                .setMessage("Logout successful")
                .get();

        } catch (error) {
            return response
                .setStatusCode(500)
                .setMessage("Failed to Logout")
                .get();
        }

    };
}