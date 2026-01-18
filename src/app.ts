import express from "express";
import type { Request, Response } from "express";
import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const redis = new Redis(process.env.REDIS_URL!);

redis.on("connect", () => {
  console.log("✅ Connected to Redis Cloud");
});

redis.on("error", (error) => {
  console.error("Redis error:", error);
});

app.get("/", async (req :Request, res:Response) => {
  await redis.set("status", "running");
  const value = await redis.get("status");
  res.json({ app: "TypeScript Backend", redis: value });
});

app.listen('3000', () => {
  console.log(`🚀 Server running on port 3000`);
});
