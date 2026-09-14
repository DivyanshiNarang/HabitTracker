import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) throw new Error("MONGO_URI is not defined!");
        const conn = await mongoose.connect(uri, {
            dbName: 'Bloom'
        });
        console.log("Succesfully connected to DB at", conn.connection.host);
    } catch (error) {
        console.log("Failed to connect DB", error.message);
        process.exit(1);
    }
}

export default connectDB;