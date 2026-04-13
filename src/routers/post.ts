import { Router } from 'express'
import { createComment } from '../controllers/comment'
import { createPost, getPost, getPosts } from '../controllers/post'
import { parseForm, validateData } from '../controllers/validation'
import { content, title } from '../lib/validator'
import passport from '../passport/passport'

const router = Router()

router.get('/', passport.authenticate('jwt', { session: false }), getPosts)
router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	title,
	content,
	validateData,
	createPost
)

router.get('/:id', passport.authenticate('jwt', { session: false }), getPost)
router.post(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	content,
	validateData,
	createComment
)

export default router
