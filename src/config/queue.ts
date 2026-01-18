import redis from "./redis.js";
import dotenv from "dotenv";
import { Queue } from "bullmq";

dotenv.config();

export const emailQueue =new Queue("email-queue",{
    connection:{
        url: process.env.REDIS_URL!
    },
});