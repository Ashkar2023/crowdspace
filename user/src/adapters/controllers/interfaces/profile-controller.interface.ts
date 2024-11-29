import { IResponse } from "@crowdspace/common";
import { Request } from "express"

export interface IProfileController {
    getUserProfile: (req: Request) => Promise<IResponse>
}