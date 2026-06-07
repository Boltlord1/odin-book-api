import { Router } from 'express'
import {
  delComment,
  getComments,
  getReplies,
  postComment
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
router.delete('/:id', jwt, delComment)
router.post(
  '/:id',
  jwt,
  validateForm,
  content('Comment'),
  validateBody,
  validateFinal,
  postComment
)

router.get('/:id/reply', jwtOptional, getReplies)

export default router
