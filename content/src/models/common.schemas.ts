import { Schema } from "mongoose";
import { GeoPoint } from "~types/post.types.js";

export const pointSchema = new Schema<GeoPoint>({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [
            {
                type:Number,
                required:true,
                min:-180,
                max:180,
            },
            {
                type:Number,
                required:true,
                min:-90,
                max:90,
            },
        ],
        required: true,
        index:"2dsphere",
        sparse:true
    },
});