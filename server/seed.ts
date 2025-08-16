import { connectDB } from "./db";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const sampleExpenses = [
  {
    title: "Groceries from Walmart",
    amount: 75.5,
    category: "Food",
    date: new Date("2025-08-12T10:00:00Z"),
    createdAt: new Date(),
  },
  {
    title: "Monthly Bus Pass",
    amount: 55.0,
    category: "Transport",
    date: new Date("2025-08-01T08:30:00Z"),
    createdAt: new Date(),
  },
  {
    title: "New T-shirt from H&M",
    amount: 25.99,
    category: "Shopping",
    date: new Date("2025-08-10T15:45:00Z"),
    createdAt: new Date(),
  },
  {
    title: "Coffee with a friend",
    amount: 8.75,
    category: "Food",
    date: new Date("2025-08-14T14:20:00Z"),
    createdAt: new Date(),
  },
  {
    title: "Electricity Bill",
    amount: 120.0,
    category: "Others",
    date: new Date("2025-08-05T11:00:00Z"),
    createdAt: new Date(),
  },
  {
    title: "Movie tickets for 'Dune'",
    amount: 32.0,
    category: "Shopping",
    date: new Date("2025-08-15T19:00:00Z"),
    createdAt: new Date(),
  },
];

async function seedDatabase() {
  let client: MongoClient | undefined;
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("Missing MongoDB connection string in MONGO_URI or MONGODB_URI");
    }
    client = await MongoClient.connect(mongoUri);
    const db = client.db(process.env.DB_NAME);

    console.log("Deleting existing expenses...");
    await db.collection("expenses").deleteMany({});

    console.log("Inserting sample expenses...");
    const result = await db.collection("expenses").insertMany(sampleExpenses);
    console.log(`${result.insertedCount} documents were inserted.`);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Failed to seed database:", error);
  } finally {
    if (client) {
      await client.close();
      console.log("Database connection closed.");
    }
    process.exit();
  }
}

seedDatabase();