import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import authRoutes from "./Routes/authRoutes.js";
dotenv.config();
// import redis from "./config/redis.js";

const app = express();


app.use("/auth",authRoutes)

// app.get("/", async (req :Request, res:Response) => {
//   await redis.set("status", "running");
//   const value = await redis.get("status");
//   res.json({ app: "TypeScript Backend", redis: value });
// });

app.listen(3000, () => {
  console.log(`🚀 Server running on port 3000`);
});
