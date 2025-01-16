import { BadRequestError, ResponseCreator } from "@cr0wdspace/common";
import { Request } from "express";
import { Types } from "mongoose";
import { ReportRepoImp } from "repositories/repositories.index.js";
import { ReportStatus } from "~types/report.types.js";

export const updateReportStatus = async (req: Request) => {
    const { report_id } = req.params as { report_id: string };
    const status = req.body.status as string;

    if (!Object.values(ReportStatus).includes(status as ReportStatus)) {
        throw new BadRequestError("given status not acceptable");
    }

    const updated = await ReportRepoImp.updateOneReportStatus(new Types.ObjectId(report_id), status as ReportStatus)

    const response = new ResponseCreator();
    return response
        .setStatusCode(200)
        .setMessage('report status updated')
        .setData({})
        .get();
}