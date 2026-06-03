import { Router } from 'express'
import {
  getChats,
  getMessages,
  getPrivateChat,
  postMessage,
  putHideChat
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

router.put('/:id', jwt, putHideChat)
router.post(
  '/:id',
  jwt,
  validateForm,
  content('Message'),
  validateBody,
  validateFinal,
  postMessage
)

export default router
