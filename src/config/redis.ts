import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis(process.env.REDIS_URL!);

redis.on("connect", () => {
  console.log("Connected to Redis Cloud");
});

redis.on("error", (error) => {
  console.error("Redis error:", error);
  return;
});

export default  redis;