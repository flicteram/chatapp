import { Router } from "express"
import { getUsers, getOtherUser } from "../controllers/users.js";
const router = Router();

router.route('/').get(getUsers)
router.route('/:id').get(getOtherUser)
export default router