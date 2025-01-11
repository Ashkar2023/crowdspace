import reportModel from "models/report.model.js";
import { HydratedDocument, Model, Types } from "mongoose";
import { IReport, IReportRequiredFields, ReportStatus } from "~types/report.types.js";

export class ReportRepository {
    #model: Model<IReport> = reportModel;

    constructor() { }

    async createReport(report: IReportRequiredFields): Promise<HydratedDocument<IReport>> {
        return await this.#model.create({
            reported_by: report.reported_by,
            target_id: report.target_id,
            target_type: report.target_type,
            description: report.description,
            reason: report.reason
        })
    }

    async checkReportExists(target_id: Types.ObjectId, reporter_id: Types.ObjectId): Promise<HydratedDocument<IReport> | null> {
        return await this.#model.findOne({
            target_id: target_id,
            reported_by: reporter_id
        })
    }

    async getReports({
        limit = 5,
        page = 1
    }
        : {
            limit: number,
            page: number
        }
    ): Promise<{
        reports: HydratedDocument<IReport>[],
        totalReports: number
    }> {
        const results = await this.#model.aggregate([
            {
                $facet: {
                    "reports": [
                        { $match: {} },
                        { $sort: { "createdAt": -1 } },
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                        {
                            $lookup: {
                                from: "posts", // CHANGE to accomodate every type when updating
                                foreignField: "_id",
                                localField: "target_id",
                                as: "target_id", //change to 'target_info'
                            }
                        },
                        {
                            $addFields: {
                                "target_id": {
                                    $arrayElemAt: ["$target_id", 0]
                                }
                            }
                        }
                    ],
                    "totalReports": [
                        { $count: 'count' }
                    ]
                }
            }
        ])

        return {
            reports: results[0].reports,
            totalReports: results[0].totalReports[0].count
        }
    }


    async updateOneReportStatus(report_id: Types.ObjectId, status: ReportStatus): Promise<HydratedDocument<IReport> | null> {
        return await this.#model.findOneAndUpdate({
            _id: report_id
        }, {
            $set: {
                status: status
            }
        })
    }
}