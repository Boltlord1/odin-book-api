import { Router } from 'express'
import { createComment } from '../controllers/comment'
import {
	createPost,
	getPost,
	getPosts,
	parseImages,
	uploadImages
} from '../controllers/post'
import { validateData } from '../controllers/validation'
import { content, title } from '../lib/validator'
import { standardOptions } from '../passport/options'
import passport from '../passport/passport'

const router = Router()

router.get('/', passport.authenticate('jwt', standardOptions), getPosts)
router.post(
	'/',
	passport.authenticate('jwt', standardOptions),
	parseImages,
	title,
	content,
	validateData,
	createPost,
	uploadImages
)

router.get('/:id', passport.authenticate('jwt', standardOptions), getPost)
router.post(
	'/:id',
	passport.authenticate('jwt', standardOptions),
	content,
	validateData,
	createComment
)

export default router
