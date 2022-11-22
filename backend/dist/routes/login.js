import { Router } from 'express';
import handleLogin from '../controllers/login.js';
const router = Router();
router.route('/').post(handleLogin);
export default router;
