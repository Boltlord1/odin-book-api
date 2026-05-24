import { Router } from 'express'
import { createReply, deleteReply, getReplies } from '../controllers/reply'
import {
  validateBody,
  validateFinal,
  validateForm
} from '../controllers/validate'
import { content } from '../lib/validator'
import { jwt, jwtOptional } from '../passport/passport'

const router = Router()

router.get('/:id', jwtOptional, getReplies)
router.delete('/:id', jwt, deleteReply)
router.post(
  '/:id',
  jwt,
  validateForm,
  content('Reply'),
  validateBody,
  validateFinal,
  createReply
)

export default router
