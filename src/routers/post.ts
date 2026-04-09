import { Router } from 'express'
import { createComment } from '../controllers/comment'
import { createPost, getPost, getPosts } from '../controllers/post'
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

router.get('/:id', passport.authenticate('jwt', { session: false }), getPost)
router.post(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	content,
	createComment
)

export default router
