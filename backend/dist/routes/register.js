import { Router } from "express";
import handleRegister from "../controllers/register.js";
const router = Router();
router.route('/').post(handleRegister);
export default router;
