import { Router } from "express";
import { createCampaign } from "../controllers/campaignController.js";

const router=Router();

router.route("/create").post(createCampaign)

export default router;