import type { tryCatch } from "bullmq";
import { emailQueue } from "./queue.js";



export async function addEmailJobsFunction (emails:string[],campaign_id:string){
    const jobs=emails.map((email)=>({
        name:"Send email job",
        data:{ email, campaign_id },
        opts:{
            delay:2000,
            attempts:3
        }
    }));
    try {
        await emailQueue.addBulk(jobs);
    } catch (error) {
        console.log(error);
    }
}