import { Router } from "express";
import { signIn } from "../controllers/authControllers.js";

const router = Router();

router.route('/signin').get(signIn); 

export default router;