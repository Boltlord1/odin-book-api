import { Router } from 'express'
import { createReply } from '../controllers/reply'
import {
  validateBody,
  validateFinal,
  validateForm
} from '../controllers/validate'
import { content } from '../lib/validator'
import { jwt } from '../passport/passport'

const router = Router()

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
