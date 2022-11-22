import { Router } from 'express';
import handleLogout from '../controllers/logout.js';
const router = Router();
router.route('/').get(handleLogout);
export default router;
