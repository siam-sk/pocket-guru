import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB, getDb } from "./db";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running");
});

// POST /expenses → Add a new expense (title, amount, category, date)
app.post("/expenses", async (req: Request, res: Response) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "title is required and must be a string" });
    }

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount)) {
      return res.status(400).json({ error: "amount is required and must be a number" });
    }

    if (!category || typeof category !== "string") {
      return res.status(400).json({ error: "category is required and must be a string" });
    }

    const expenseDate = date ? new Date(date) : new Date();
    if (Number.isNaN(expenseDate.getTime())) {
      return res.status(400).json({ error: "date must be a valid date string" });
    }

    const db = getDb();
    const resInsert = await db.collection("expenses").insertOne({
      title,
      amount: parsedAmount,
      category,
      date: expenseDate,
      createdAt: new Date(),
    });

    const created = await db.collection("expenses").findOne({ _id: resInsert.insertedId });
    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /expenses → Fetch all expenses
app.get("/expenses", async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const expenses = await db
      .collection("expenses")
      .find()
      .sort({ date: -1, createdAt: -1 })
      .toArray();
    return res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  });