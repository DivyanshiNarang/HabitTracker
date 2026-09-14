import { Habit } from '../models/habit.js';
import { HabitLog } from '../models/habitLog.js';

export const getHabits = async (req, res) => {
    try {
        const { includedArchived } = req.query;
        const filter = { userId: req.user._id };
        if (includedArchived !== "true") filter.isArchived = false;

        const habits = await Habit.find(filter).sort({ order: 1, createdAt: 1 });

        res.json({ habits });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createHabit = async (req, res) => {
    try {
        const { name, description, category, frequency, color, icon, targetDays } = req.body;

        if (!name) return res.status(400).json({ message: "Habit name is required." });

        const count = await countDocuments({ userId: req.user._id });

        const habit = await User.insertOne({
            userId: req.user._id,
            name,
            description,
            category,
            frequency,
            color,
            icon,
            targetDays,
            order: count,
        })

        res.status(201).json(habit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateHabit = async (req, res) => {
    try {
        const habit = await User.findOne({
            _id: req.params.id,
            userId: req.user._id, // using userId so that any user can't accidently update other user's habit
        })

        if (!habit) return res.status(404).json({ message: "Habit does not exist." });

        const fields = [
            "name",
            "description",
            "category",
            "frequency",
            "color",
            "icon",
            "targetDays",
            "order",];

        for (const f of fields) {
            if (req.body[f] !== undefined) habit[f] = req.body[f];
        }

        await habit.save();

        res.status(200).json(habit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteHabit = async (req, res) => {
    try {
        const habit = await findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        })

        if (!habit) return res.status(404).json({ message: "Habit not found." });

        await HabitLog.deleteMany({
            habitId: habit._id,
            userId: req.user._id,
        })

        res.status(204).json({ message: "Habit deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const archiveHabit = async (req, res) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.user._id,
        })

        if (!habit) return res.status(404).json({ message: "Habit not found." });

        habit.isArchived = !habit.isArchived;

        await habit.save();

        res.status(200).json(habit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const reorderHabits = async (req, res) => {
    try {
        const { order } = req.body;

        if (!Array.isArray(order)) return res.status(404).json({ message: "Order must be an array." });

        await Promise.all(
            order.map((id, idx) =>
                Habit.updateOne(
                    { _id: id, userId: req.user._id },
                    { $set: { order: idx } }
                )
            ));
        res.status(200).json({ message: "Habits list reordered" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}