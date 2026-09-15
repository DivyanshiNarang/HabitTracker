import mongoose from "mongoose";

// Serverless invocations reuse the same Node process between cold starts, so the
// connection is cached on globalThis. Without this every request opens a new
// connection and quickly exhausts the Atlas connection limit.
const cache = globalThis.__mongooseCache ?? (globalThis.__mongooseCache = {
    conn: null,
    promise: null,
});

const connectDB = async () => {
    if (cache.conn) return cache.conn;

    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is not defined!");

    if (!cache.promise) {
        cache.promise = mongoose.connect(uri, {
            dbName: 'Bloom',
            serverSelectionTimeoutMS: 10000,
        });
    }

    try {
        cache.conn = await cache.promise;
    } catch (error) {
        cache.promise = null; // let the next request retry instead of caching the failure
        throw error;
    }

    console.log("Succesfully connected to DB at", cache.conn.connection.host);
    return cache.conn;
}

export default connectDB;
