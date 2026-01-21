import { Router } from "express";
import { createCampaign, getEmailJobs, getPendingCampaigns } from "../controllers/campaignController.js";
import { protection } from "../controllers/authControllers.js";

const router=Router();

router.route("/create").post(protection, createCampaign)
router.route("/allcampaigns").get(protection, getPendingCampaigns)
router.route("/jobs/campaign").post(protection, getEmailJobs)


export default router;