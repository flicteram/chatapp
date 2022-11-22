import { Router } from 'express'
import handleLogin from '../controllers/auth.js';

const router = Router();

router.route('/').post(handleLogin)

export default router