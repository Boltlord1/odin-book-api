import { Router } from 'express'
import {
  createComment,
  deleteComment,
  getComments
} from '../controllers/comment'
import {
  validateBody,
  validateFinal,
  validateForm
} from '../controllers/validate'
import { content } from '../lib/validator'
import { jwt, jwtOptional } from '../passport/passport'

const router = Router()

router.get('/:id', jwtOptional, getComments)
router.delete('/:id', jwt, deleteComment)
router.post(
  '/:id',
  jwt,
  validateForm,
  content('Comment'),
  validateBody,
  validateFinal,
  createComment
)

export default router
