
const allowedOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

export const corsOptions = {
    origin(origin, cb) {
        // allow requests with no origin (curl, same-origin, server-to-server)
        if (!origin) return cb(null, true);

        // allow localhost /127.0.0.1 origin in development
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return cb(null, true);

        // allow anything explicitly listed in CLIENT_URL (comma-separated)
        if (allowedOrigins.includes(origin)) return cb(null, true);
        return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
} 