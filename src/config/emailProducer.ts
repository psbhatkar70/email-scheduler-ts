import type { tryCatch } from "bullmq";
import { emailQueue } from "./queue.js";


function getDelay(scheduled_at:string){
        const time=new Date(scheduled_at).getTime();
        console.log(time);
        const today=Date.now();
        console.log(today);
        console.log(Math.max(time-today+2000,2000));
        return Math.max(time-today+2000,2000);
    }


export async function addEmailJobsFunction (emails:string[],campaign_id:string , scheduled_at:string , body:string , subject:string , from :string){
    const jobs=emails.map((email)=>({
        name:"Send email job",
        data:{ email, campaign_id , body , subject},
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