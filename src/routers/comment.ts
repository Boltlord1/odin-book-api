import { Router } from 'express'
import { createComment, getComments } from '../controllers/comment'
import { validateBody, validateFinal } from '../controllers/validate'
import { comment } from '../lib/validator'
import { jwt, jwtOptional } from '../passport/passport'

const router = Router()

router.get('/:id', jwtOptional, getComments)
router.post('/:id', jwt, comment, validateBody, validateFinal, createComment)

export default router
