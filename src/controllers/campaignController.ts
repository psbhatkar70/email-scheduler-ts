import type { Response, Request } from "express";
import { supabase } from "../config/db.js";
import e from "express";

export const createCampaign = async (req:Request , res:Response)=>{
    try {
        const { user_id , title , scheduled_at }=req.body;
        const { data ,error}= await supabase
        .from("campaigns")
        .insert({
            'user_id':user_id,
            'title':title,
            "scheduled_at":scheduled_at
        })

        if(error){
            return res.status(404).json({
                error:error
            });
        }

        return res.status(200).json({
            message:"Success"
        });
        

    } catch (error) {
        return res.status(500).json({
            error
        });
    }
}