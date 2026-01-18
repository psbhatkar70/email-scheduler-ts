import { Job, Worker } from "bullmq";
import dotenv from "dotenv";
import { supabase } from "./db.js";


dotenv.config();


export const emailWorker=new Worker("email-queue",
    async(job:Job)=>{
        console.log(job.data);
        console.log("Heloo from worker")
        const {email , campaign_id}=job.data;
        try {
            const {error}=await supabase
            .from("email_logs")
            .insert({
                recipient_email:email,
                status:"pending",
                campaign_id:campaign_id
            });

            if(error) throw error;

        } catch (error) {
        console.error("Worker error:", error);
        throw error;
        }
    },{
        connection:{
            url:process.env.REDIS_URL!,
        },
    }
);

