import { Router } from 'express'
import { createReply } from '../controllers/reply'
import { validateBody, validateFinal } from '../controllers/validate'
import { comment } from '../lib/validator'
import { jwt } from '../passport/passport'

const router = Router()

router.post('/:id', jwt, comment, validateBody, validateFinal, createReply)

export default router
