import { Job, Worker } from "bullmq";
import dotenv from "dotenv";
import { supabase } from "./db.js";
import nodemailer from "nodemailer";


dotenv.config();

    const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'andrew48@ethereal.email',
        pass: 'CZ78zyqNmWztBtq32u'
    }
});
    
    
    new Worker("email-queue",
    async(job:Job)=>{
        console.log(job.data);
        console.log("Heloo from worker")
        const {email , campaign_id , body , subject , from}=job.data;
        try {
            
            
            
            const message={
                from: `Sender Name <andrew48@ethereal.email>`,
                to: `Recipient <${email}>`,
                subject: subject,
                text: body,
            }
            
            transporter.sendMail(message,async (error, info) => {
                     if (error){
                        console.log('Error occurred. ' + error.message);
                        const {error :dataerror }=await supabase
                        .from("email_logs")
                        .update({
                            error_message:error.message
                        })
                        .match({
                            campaign_id:campaign_id,
                            recipient_email:email
                        });

                        throw error;

                    }
            
                    console.log('Message sent: %s', info.messageId);
                    const {error :dataerror }=await supabase
                        .from("email_logs")
                        .update({
                            status:"SENT",
                            sent_at:new Date(Date.now())
                        })
                        .match({
                            campaign_id:campaign_id,
                            recipient_email:email
                        });
                        if(dataerror){
                            console.log(dataerror);
                        }
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                });
            
            

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

