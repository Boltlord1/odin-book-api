import { Router } from 'express'
import { createComment } from '../controllers/comment'
import { content } from '../lib/validator'
import passport from '../passport/passport'

const router = Router()

router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	content,
	createComment
)

export default router
