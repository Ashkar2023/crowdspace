import reportModel from "models/report.model.js";
import { Model } from "mongoose";
import { IReport, IReportRequiredFields } from "~types/report.types.js";

export class ReportRepository {
    #model: Model<IReport> = reportModel;

    constructor() { }

    async createReport(report: IReportRequiredFields) {
        return await this.#model.create({
            reported_by: report.reported_by,
            target_id: report.target_id,
            target_type: report.target_type,
            description: report.description,
            reason: report.reason
        })
    }
}