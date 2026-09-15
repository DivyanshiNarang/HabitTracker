// Local / long-running server entry point.
// On Vercel the app is served by api/index.js instead, which has no listen().
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 8000;

try {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server started at port ${PORT}`)
    })
} catch (error) {
    console.error("Failed to connect DB", error.message);
    process.exit(1);
}
