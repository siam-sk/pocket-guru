import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "../db";
import { z } from "zod";

const router = Router();

// Zod schemas for validation
const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const db = getDb(); 
    const { email, password } = registerSchema.parse(req.body);

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "User registered successfully", userId: result.insertedId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format Zod errors for better display on the frontend
      const formattedErrors = error.issues.map(e => e.message).join('. ');
      return res.status(400).json({ error: formattedErrors });
    }
    res.status(500).json({ error: "Server error during registration." });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const db = getDb(); 
    const { email, password } = loginSchema.parse(req.body);

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      { userId: user._id.toHexString() },
      process.env.JWT_SECRET || "your_default_secret",
      { expiresIn: "1h" }
    );

    res.json({ token, userId: user._id.toHexString() });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues.map(e => e.message).join('. ');
      return res.status(400).json({ error: formattedErrors });
    }
    res.status(500).json({ error: "Server error during login." });
  }
});

export default router;