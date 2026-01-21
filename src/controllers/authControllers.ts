import type { Response, Request, NextFunction } from "express";
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


export const protection = async(req:Request , res:Response , next : NextFunction)=>{
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(403).json({
                message:"Header not provided"
            });
        }

        const token = authHeader.split(" ")[1];

        if(!token){
            return res.status(403).json({
                message:"Token not provided"
            });
        }

        const {data , error } = await supabase.auth.getUser(token);
        if(error || !data.user) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user=data.user;
        return next();
        
    } catch (error) {
         return res.status(401).json({
            status:"Fail",
            message:error
        });
    }
}