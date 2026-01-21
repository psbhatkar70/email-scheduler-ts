import type { Response, Request } from "express";
import { supabase } from "../config/db.js";
import { addEmailJobsFunction } from "../config/emailProducer.js";


export const createCampaign = async (req:Request , res:Response)=>{
    try {
        if(!req.user){
            return res.status(403).json({
                message:"Acess not available"
            });
        }
        const {  title , scheduled_at , emails , body , subject }=req.body;
        const user_id=req.user.id;
        const from =req.body ||  req.user.email;
        if(!from){
            return res.status(401).json({
                message:"No email id available"
            })
        }
        const { data ,error}= await supabase
        .from("campaigns")
        .insert({
            user_id:user_id,
            title:title,
            scheduled_at:scheduled_at,
            body:body,
            subject:subject
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
            status:"pending",
            user_id:user_id
        }))
        const {error:erroremail , data:dataemail }=await supabase
            .from("email_logs")
            .insert(emailsLog)
            

            if(erroremail) throw erroremail

        await addEmailJobsFunction(emails , data.id, scheduled_at , body , subject , from);
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

export const getPendingCampaigns= async (req:Request , res:Response)=>{
    try {
        if(!req.user){
            return res.status(403).json({
                message:"Acess not available"
            });
        }

        const user_id = req.user.id;

        const {data , error }= await supabase
        .from("campaigns")
        .select()
        .eq("user_id",user_id)
        .order("created_at",{ascending:true})

        if(!data){
            return res.status(404).json({
                message:"No campaigns"
            })
        }

        if(error){
            return res.status(500).json({
                message:error
            })
        };

        return res.status(200).json({
            data:data
        })


    } catch (error) {
         return res.status(500).json({
                message:error
            })
    }
}

export const getEmailJobs= async (req:Request , res:Response)=>{
    try {
        if(!req.user){
            return res.status(403).json({
                message:"Acess not available"
            });
        }
        
        const user_id = req.user.id;
        const {campaign_id}=req.body;

        const {data , error }= await supabase
        .from("email_logs")
        .select()
        .match({
            user_id:user_id,
            campaign_id:campaign_id
        })

        if(!data){
            return res.status(404).json({
                message:"Not found"
            })
        }

        if(error){
            return res.status(500).json({
                message:error
            });
        }

        return res.status(200).json({
            data:data
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Fail"
        })
    }
}