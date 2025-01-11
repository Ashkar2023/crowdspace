import { BadRequestError, ResponseCreator, UnauthorizedError } from "@crowdspace/common";
import { Request } from "express";
import { isValidObjectId, Types } from "mongoose";
import { ReportRepoImp } from "repositories/repositories.index.js";

export const reportPost = async (req: Request) => {
    const reported_by = req.headers["x-logged-in-user"] as string;
    const {
        target_id,
        target_type,
        reason,
        description
    } = req.body;

    if (!reported_by) throw new UnauthorizedError("User not found", 401)

    if (await ReportRepoImp.checkReportExists(
        new Types.ObjectId(target_id as string),
        new Types.ObjectId(reported_by))
    ) {
        throw new BadRequestError("report exits");
    }

    /* VALIDATE Req Body */

    if (!isValidObjectId(target_id)) throw new BadRequestError("No valid target found")

    /* wrap in try catch to handle database errors OR handle in global err handler*/


    const reportCreated = await ReportRepoImp.createReport({
        target_type,
        reason,
        description,
        target_id: new Types.ObjectId(target_id as string),
        reported_by: new Types.ObjectId(reported_by)
    })

    const response = new ResponseCreator();
    return response
        .setStatusCode(201)
        .setData({ ...reportCreated.toObject() })
        .setMessage("Report successfull")
        .get();
}