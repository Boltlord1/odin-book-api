import { Router } from 'express'
import { createMessage, getChat, getChats } from '../controllers/chat'
import { validateBody, validateFinal } from '../controllers/validate'
import { content } from '../lib/validator'
import { jwt } from '../passport/passport'

const router = Router()

router.get('/', jwt, getChats)
router.get('/:id', jwt, getChat)
router.post('/:id', jwt, content, validateBody, validateFinal, createMessage)

export default router
