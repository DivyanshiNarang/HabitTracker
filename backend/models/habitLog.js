import { model, Schema } from "mongoose";

const habitLogSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    habitId: {
        type: Schema.Types.ObjectId,
        ref: "Habit",
        required: true,
        index: true,
    },
    completedDate: {
        type: String, // YYYY-MM-DD (simpler range queries, prevents timezone bugs, simpler comparison)
        required: true,
    },
    notes: { type: String, default: "" },
}, { timestamps: true });

habitLogSchema.index(
    { userId: 1, habitId: 1, completedDate: 1, },
    { unique: true },
)

export const HabitLog = model("HabitLog", habitLogSchema);