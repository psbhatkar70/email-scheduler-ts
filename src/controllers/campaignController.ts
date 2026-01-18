import type { Response, Request } from "express";
import { supabase } from "../config/db.js";
import { addEmailJobsFunction } from "../config/emailProducer.js";

export const createCampaign = async (req:Request , res:Response)=>{
    try {
        const { user_id , title , scheduled_at , emails}=req.body;
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

        await addEmailJobsFunction(emails , data.id);
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