import { Router } from 'express'
import { newConversation, newMessage, getConversation, getConversationNew, seenMessages } from '../controllers/conversation.js'

const router = Router();

router.route('/').post(newConversation)
router.route('/:id').get(getConversation).post(newMessage)
router.route('/new/:id').get(getConversationNew)
router.route('/seen/:id').post(seenMessages)

export default router