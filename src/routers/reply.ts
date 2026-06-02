import { Router } from 'express'
import { delReply, getReplies, postReply } from '../controllers/reply'
import {
  validateBody,
  validateFinal,
  validateForm
} from '../controllers/validate'
import { content } from '../lib/validator'
import { jwt, jwtOptional } from '../passport/passport'

const router = Router()

router.get('/:id', jwtOptional, getReplies)
router.delete('/:id', jwt, delReply)
router.post(
  '/:id',
  jwt,
  validateForm,
  content('Reply'),
  validateBody,
  validateFinal,
  postReply
)

export default router
