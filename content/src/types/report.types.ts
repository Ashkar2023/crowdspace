import { UUID } from "crypto";
import { Schema, Types } from "mongoose";

export enum ReportStatus {
    pending = "pending",
    reviewed = "reviewed",
    dismissed = "dismissed",
    resolved = "resolved",
}

export enum ReportReasons {
    HARASSMENT = 'harassment',
    NUDITY = 'nudity',
    HATE_SPEECH = 'hate_speech',
    SPAM = 'spam',
    VIOLENCE = 'violence',
    MISINFORMATION = 'misinformation',
    SELF_HARM = 'self_harm',
    INAPPROPRIATE_CONTENT = 'inappropriate_content',
    COPYRIGHT_VIOLATION = 'copyright_violation',
    OTHER = 'other'
}

export enum ReportTargets {
    POST = 'post',
    // COMMENT = 'comment',
    // COMMUNITY = 'community'
}

export interface IReportRequiredFields {
    reported_by: Types.ObjectId;
    target_id: Types.ObjectId;
    target_type: ReportTargets;
    reason: ReportReasons; // Use your enum or string union type
    description?: string;
}

export type IReport = IReportRequiredFields & {
    status: ReportStatus,
    tokenId: Schema.Types.UUID
}