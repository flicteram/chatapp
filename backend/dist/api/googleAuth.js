import { Router } from 'express';
import googleAuth from '../controllers/googleAuth.js';
const router = Router();
router.route('/').post(googleAuth);
export default router;
