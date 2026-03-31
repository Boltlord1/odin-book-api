import { Router } from 'express'
import { createPost, getPosts } from '../controllers/post'
import { content, title } from '../lib/validator'
import passport from '../passport/passport'

const router = Router()

router.get('/', passport.authenticate('jwt', { session: false }), getPosts)
router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	title,
	content,
	createPost
)

export default router
