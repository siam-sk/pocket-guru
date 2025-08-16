import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "pocket_guru";

const client = new MongoClient(uri);
let db: Db | null = null;

export async function connectDB(): Promise<Db> {
    if (!db) {
        await client.connect();
        db = client.db(dbName);
        console.log(`[db]: Connected to ${dbName}`);
    }
    return db;
}

export function getDb(): Db {
    if (!db) throw new Error("Database not connected. Call connectDB() first.");
    return db;
}

export async function closeDB() {
    if (client) {
        await client.close();
        db = null; 
    }
}