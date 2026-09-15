import { model, Schema } from "mongoose"

const CATEGORIES = [
    "Health",
    "Fitness",
    "Learning",
    "Mindfulness",
    "Productivity",
    "Social",
    "Finance",
    "Creative",
    "Other",
]

const habitSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
        trim: true,
    },
    category: {
        type: String,
        enum: CATEGORIES,
        default: "Other",
    },
    frequency: {
        type: String,
        enum: ["daily", "weekly"],
        default: "daily",
    },
    targetDays: {
        type: Number,
        default: 7, min: 1, max: 7,
    },
    color: {
        type: String, default: "#628786"
    },
    icon: { type: String, default: "🎯" },
    isArchived: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
}, { timestamps: true });

export const HABIT_CATEGORIES = CATEGORIES;
export const Habit = model("Habit", habitSchema);