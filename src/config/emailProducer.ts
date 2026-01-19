import type { tryCatch } from "bullmq";
import { emailQueue } from "./queue.js";


function getDelay(scheduled_at:string){
        const time=new Date(scheduled_at).getTime();
        const today=Date.now();
        return Math.max(time-today,0);
    }


export async function addEmailJobsFunction (emails:string[],campaign_id:string , scheduled_at:string){
    const jobs=emails.map((email)=>({
        name:"Send email job",
        data:{ email, campaign_id },
        opts:{
            delay:getDelay(scheduled_at),
            attempts:3
        }
    }));
    try {
        await emailQueue.addBulk(jobs);
    } catch (error) {
        console.log(error);
    }
}