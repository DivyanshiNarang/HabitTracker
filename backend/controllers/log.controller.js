import { Habit } from '../models/habit.js';
import { HabitLog } from '../models/habitLog.js';
import { calcStreak, last90Days, lastNDays, toDateKey, todayKey } from '../utils/dateHelper.js';

export const markCompleted = async (req, res) => {
    try {
        const { habitId, date } = req.body;
        const completedDate = date || todayKey();

        const habit = await Habit.findOne({ _id: habitId, userId: req.user._id });

        if (!habit) return res.status(404).json({ message: "Habit is not found." });

        const log = await HabitLog.findOneAndUpdate(
            { habitId, userId: req.user._id, completedDate },
            { $setOnInsert: { habitId, userId: req.user._id, completedDate } },
            { upsert: true, new: true });

        return res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const unmarkComplete = async (req, res) => {
    try {
        const { habitId, date } = req.body;
        const completedDate = date || todayKey();

        await HabitLog.findOneAndDelete(
            { habitId, userId: req.user._id, completedDate });

        return res.status(204).json({ message: 'Unmarked' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getToday = async (req, res) => {
    try {
        const logs = await HabitLog.find(
            { userId: req.user._id, completedDate: todayKey() });

        return res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getRange = async (req, res) => {
    try {
        const { start, end } = req.query;
        const logs = await HabitLog.find(
            { userId: req.user._id, completedDate: { $gte: start, $lte: end } });

        return res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getHeatMap = async (req, res) => {
    try {
        const days = last90Days();

        const logs = await HabitLog.find(
            { userId: req.user._id, completedDate: { $gte: days[0], $lte: days[days.length - 1] } });

        const counts = {};
        for (const d of days) counts[d] = 0;
        for (const l of logs) counts[l.completedDate] = (counts[l.completedDate] || 0) + 1;

        const data = days.map(d => ({ date: d, count: counts[d] || 0 }));

        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getHabitStats = async (req, res) => {
    try {
        const habit = await Habit.findOne({ _id: req.params.habitId, userId: req.user._id });

        if (!habit) return res.status(404).json({ message: "Habit is not found." });

        const logs = await HabitLog.find({
            userId: req.user._id,
            habitId: habit._id,
        }).sort({ completedDate: -1 });

        const dateKeys = logs.map(l => l.completedDate);
        const { current, longest } = calcStreak(dateKeys);

        // completion rate since habit created
        const createdKey = habit.createdAt.toISOString().slice(0, 10);
        const start = new Date(createdKey);
        const end = new Date(todayKey());

        const totalDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24))) + 1;
        const completionRate = Math.round((logs.length / totalDays) * 100);

        // monthly breakdown (last 6 months)
        const monthly = {};
        for (const l of logs) {
            const m = l.completedDate.slice(0, 7);
            monthly[m] = (monthly[m] || 0) + 1;
        }

        res.json({
            habit,
            totalCompletions: logs.length,
            currentStreak: current,
            longestStreak: longest,
            completionRate,
            monthly,
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllStats = async (req, res) => {
    try {
        const habits = await Habit.findOne({ isArchived: false, userId: req.user._id });
        const days = lastNDays(30);
        const logs = await HabitLog.find({
            userId: req.user._id,
            completedDate: { $gte: days[0], $lte: days[days.length - 1] }
        });

        const perHabit = habits.map((h) => {
            const hLogs = logs.filter((l) => String(l.habitId) === String(h._id));
            const keys = hLogs.map((l) => l.completedDate).sort().reverse();
            const { current, longest } = calcStreak(keys);
            return {
                habitId: h._id,
                name: h.name,
                icon: h.icon,
                color: h.color,
                category: h.category,
                currentStreak: current,
                longest: longest,
                completions30d: hLogs.length,
            }
        })

        res.json({ perHabit, days });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}