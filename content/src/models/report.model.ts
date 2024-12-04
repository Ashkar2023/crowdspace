import { randomUUID } from "crypto";
import { model, Schema, Types } from "mongoose";
import { IReport, ReportReasons, ReportStatus, ReportTargets } from "~types/report.types.js";

const reportSchema = new Schema<IReport>(
    {
        reported_by: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        target_id: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        target_type: {
            type: String,
            enum: Object.values(ReportTargets),
            required: true,
        },
        reason: {
            type: String,
            required: true,
            enum: Object.values(ReportReasons)
        },
        description: {
            type: String,
            default: null,
            maxlength: 500
        },
        status: {
            type: String,
            enum: Object.values(ReportStatus),
            default: ReportStatus.pending,
        },
        tokenId: {
            type: Schema.Types.UUID,
            default: () => randomUUID()
        }
    },
    {
        timestamps: true,
        toObject: {
            transform(doc, ret) {
                delete ret._id;
            },
        }
    }
);

export default model('report', reportSchema, "reports");
