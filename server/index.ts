import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB, getDb } from "./db";
import { ObjectId } from "mongodb";

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

    // title: required, string, min length 3
    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return res.status(400).json({ error: "title is required, must be a string and at least 3 characters" });
    }

    // amount: required, number > 0
    if (amount === undefined || amount === null) {
      return res.status(400).json({ error: "amount is required and must be a number greater than 0" });
    }
    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: "amount must be a number greater than 0" });
    }

    // category: required string
    if (!category || typeof category !== "string") {
      return res.status(400).json({ error: "category is required and must be a string" });
    }

    // date: required, valid date
    if (!date) {
      return res.status(400).json({ error: "date is required and must be a valid date string" });
    }
    const expenseDate = new Date(date);
    if (Number.isNaN(expenseDate.getTime())) {
      return res.status(400).json({ error: "date must be a valid date string" });
    }

    const db = getDb();
    const resInsert = await db.collection("expenses").insertOne({
      title: title.trim(),
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
    const { category, startDate, endDate } = req.query;
    const query: Record<string, any> = {};

    if (category && typeof category === "string" && category !== "All") {
      query.category = category;
    }

    if (startDate && typeof startDate === "string") {
      query.date = { ...query.date, $gte: new Date(startDate) };
    }

    if (endDate && typeof endDate === "string") {
      
      const endOfDay = new Date(endDate);
      endOfDay.setDate(endOfDay.getDate() + 1);
      query.date = { ...query.date, $lt: endOfDay };
    }

    const db = getDb();
    const expenses = await db
      .collection("expenses")
      .find(query)
      .sort({ date: -1, createdAt: -1 })
      .toArray();
    return res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /expenses/:id → Update an expense
app.patch("/expenses/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "invalid id" });
    }

    const { title, amount, category, date } = req.body;
    const update: Record<string, unknown> = {};

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length < 3) {
        return res.status(400).json({ error: "title must be a string and at least 3 characters" });
      }
      update.title = title.trim();
    }

    if (amount !== undefined) {
      const parsed = Number(amount);
      if (Number.isNaN(parsed) || parsed <= 0) {
        return res.status(400).json({ error: "amount must be a number greater than 0" });
      }
      update.amount = parsed;
    }

    if (category !== undefined) {
      if (typeof category !== "string") return res.status(400).json({ error: "category must be a string" });
      update.category = category;
    }

    if (date !== undefined) {
      const parsedDate = new Date(date);
      if (Number.isNaN(parsedDate.getTime())) return res.status(400).json({ error: "date must be a valid date" });
      update.date = parsedDate;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: "no valid fields to update" });
    }

    update.updatedAt = new Date();

    const db = getDb();
    const result = await db.collection("expenses").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );

    if (!result || !result.value) return res.status(404).json({ error: "expense not found" });
    return res.status(200).json(result.value);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
});

// DELETE /expenses/:id → Delete an expense
app.delete("/expenses/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "invalid id" });
    }

    const db = getDb();
    const result = await db.collection("expenses").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "expense not found" });
    }

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
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