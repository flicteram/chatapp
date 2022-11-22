import { Router } from "express"
import handleRefresh from "../controllers/refresh.js";
const router = Router();

router.route('/').get(handleRefresh)

export default router