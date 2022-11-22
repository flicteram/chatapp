import { Router } from 'express'
import { getConversations } from '../controllers/conversations.js'

const router = Router();

router.route('/').get(getConversations)

export default router