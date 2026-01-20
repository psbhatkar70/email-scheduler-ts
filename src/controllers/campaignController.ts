import type { Response, Request } from "express";
import { supabase } from "../config/db.js";
import { addEmailJobsFunction } from "../config/emailProducer.js";


export const createCampaign = async (req:Request , res:Response)=>{
    try {
        const { user_id , title , scheduled_at , emails , body , subject }=req.body;
        const { data ,error}= await supabase
        .from("campaigns")
        .insert({
            user_id:user_id,
            title:title,
            scheduled_at:scheduled_at
        })
        .select()
        .single();
        
        if(!data){
            return res.status(500).json({
                message:"Unable to create campaign"
            });
        }
        if(error){
            return res.status(404).json({
                error:error
            });
        }
        const emailsLog= emails.map((email:any) =>({
            recipient_email:email,
            campaign_id:data.id,
            status:"pending"
        }))
        const {error:erroremail , data:dataemail }=await supabase
            .from("email_logs")
            .insert(emailsLog)
            

            if(erroremail) throw erroremail

        await addEmailJobsFunction(emails , data.id, scheduled_at , body , subject);
        return res.status(200).json({
            message: "Campaign created & emails queued",
            campaign_id: data.id,
    });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error
        });
    }
}