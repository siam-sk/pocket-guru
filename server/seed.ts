import { connectDB, closeDB } from "./db";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();


const TARGET_USER_EMAIL = "jd@ex.com";

const getSampleExpenses = (userId: ObjectId) => [
  {
    title: "Groceries from Walmart",
    amount: 75.5,
    category: "Food",
    date: new Date("2025-08-12T10:00:00Z"),
    userId,
    createdAt: new Date(),
  },
  {
    title: "Monthly Bus Pass",
    amount: 55.0,
    category: "Transport",
    date: new Date("2025-08-01T08:30:00Z"),
    userId,
    createdAt: new Date(),
  },
  {
    title: "New T-shirt from H&M",
    amount: 25.99,
    category: "Shopping",
    date: new Date("2025-08-10T15:45:00Z"),
    userId,
    createdAt: new Date(),
  },
  {
    title: "Coffee with a friend",
    amount: 8.75,
    category: "Food",
    date: new Date("2025-08-14T14:20:00Z"),
    userId,
    createdAt: new Date(),
  },
  {
    title: "Electricity Bill",
    amount: 120.0,
    category: "Others",
    date: new Date("2025-08-05T11:00:00Z"),
    userId,
    createdAt: new Date(),
  },
  {
    title: "Movie tickets for 'Dune'",
    amount: 32.0,
    category: "Shopping",
    date: new Date("2025-08-15T19:00:00Z"),
    userId,
    createdAt: new Date(),
  },
];

async function seedDatabase() {
  try {
    const db = await connectDB();

    console.log(`Looking for user: ${TARGET_USER_EMAIL}...`);
    const user = await db.collection("users").findOne({ email: TARGET_USER_EMAIL });

    if (!user) {
      console.error(`Error: User with email "${TARGET_USER_EMAIL}" not found.`);
      console.error("Please register the user first or change the TARGET_USER_EMAIL in the seed script.");
      return;
    }

    const userId = user._id;
    console.log(`Found user with ID: ${userId}. Seeding expenses...`);

    
    const deleteResult = await db.collection("expenses").deleteMany({ userId: userId });
    console.log(`Deleted ${deleteResult.deletedCount} existing expenses for this user.`);

    const sampleExpenses = getSampleExpenses(userId);
    const result = await db.collection("expenses").insertMany(sampleExpenses);
    console.log(`${result.insertedCount} new expense documents were inserted for the user.`);

    console.log("Database seeded successfully for the specified user!");
  } catch (error) {
    console.error("Failed to seed database:", error);
  } finally {
    await closeDB();
    console.log("Database connection closed.");
    process.exit();
  }
}

seedDatabase();