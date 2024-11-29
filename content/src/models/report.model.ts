import { model, Schema } from "mongoose";
import { ReportStatus } from "~types/report.types.js";

const reportSchema = new Schema(
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
            enum: ['post', 'comment', 'community'],
            required: true,
        },
        reason: {
            type: String,
            required: true,

        },
        description: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: Object.values(ReportStatus),
            default: ReportStatus.pending,
        }
    },
    {
        timestamps: true
    }
);

module.exports = model('Report', reportSchema);
