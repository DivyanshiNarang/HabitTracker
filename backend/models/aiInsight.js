import { model, Schema } from 'mongoose';

// for history, caching, for improving prompts

const aiInsightSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ["weekly", "suggestion", "recovery", "chat", "morning"],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        meta: {
            type: Schema.Types.Mixed,
            default: {},
        },
        generatedAt: {
            type: Date,
            default: Date.now
        },
    },
    { timestamps: true }
);

export const AIInsight = model("AIInsight", aiInsightSchema);