import 'dotenv/config';
import cors from "cors";
import express from 'express';
import { corsOptions } from './config/cors.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/auth.js';
import habitRoutes from './routes/habit.js';
import logRoutes from './routes/logs.js';
import aiRoutes from './routes/ai.js';

const app = express();

// middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }))

// health check route
app.get('/api/health', (req, res) =>
    res.json({
        status: 'ok',
        time: new Date().toISOString()
    }))

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
