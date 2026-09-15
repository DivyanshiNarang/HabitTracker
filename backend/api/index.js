// Vercel serverless entry point. Every request is rewritten here by vercel.json,
// so the connection is established once per cold start and reused after that.
import app from '../app.js';
import connectDB from '../config/db.js';

export default async function handler(req, res) {
    try {
        await connectDB();
    } catch (error) {
        console.error("DB connection failed", error.message);
        return res.status(503).json({ message: "Database unavailable. Please try again." });
    }

    return app(req, res);
}
