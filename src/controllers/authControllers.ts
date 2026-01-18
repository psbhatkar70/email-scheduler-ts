import type { Response, Request } from "express";
import { supabase } from "../config/db.js";

export const signIn =async ( req :Request ,res:Response)=>{
    try {
        const {data , error }= await supabase.auth.signInWithOAuth({
            provider:'google'
        });
        if(error){
            return res.status(400).json({
                error
            });
        }
        return res.status(200).json({
            data:data
        });
    } catch (error) {
        return res.status(500).json({
            error:error
        });
    }
}