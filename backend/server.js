import 'dotenv/config';
import cors from "cors";
import express from 'express';
import connectDB from './config/db.js';
import { corsOptions } from './config/cors.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/auth.js';
import habitRoutes from './routes/habit.js';

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

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
await connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started at port ${PORT}`)
    })
})