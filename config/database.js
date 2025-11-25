import mongoose from 'mongoose'
import env from 'dotenv'

env.config()

const dbUser = process.env.MONGODB_USER;
const dbPassword = process.env.MONGODB_PASSWORD;
const dbName = process.env.MONGODB_DBNAME;

const mongoURI = `mongodb+srv://${dbUser}:${dbPassword}@dev-users.9mtcsr2.mongodb.net/${dbName}?retryWrites=true&w=majority`;

export default async function connectDB() {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed');
        console.error(error);
    }
}