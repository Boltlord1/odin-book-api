import { Router } from 'express'
import {
  getChats,
  getMessages,
  getPrivateChat,
  postPrivateMessage
} from '../controllers/chat'
import {
  validateBody,
  validateFinal,
  validateForm
} from '../controllers/validate'
import { content } from '../lib/validator'
import { jwt } from '../passport/passport'

const router = Router()

router.get('/', jwt, getChats)
router.get('/:id', jwt, getMessages)
router.get('/private/:id', jwt, getPrivateChat)
router.post(
  '/private/:id',
  jwt,
  validateForm,
  content('Message'),
  validateBody,
  validateFinal,
  postPrivateMessage
)

export default router
