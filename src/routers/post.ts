import { Router } from 'express'
import { uploadImages } from '../controllers/cloudinary'
import {
	createComment,
	createPost,
	getComments,
	getPost,
	likeComment,
	likePost,
	unlikeComment,
	unlikePost
} from '../controllers/post'
import { getPosts } from '../controllers/user'
import {
	validateBody,
	validateFinal,
	validateImages
} from '../controllers/validate'
import { content, title } from '../lib/validator'
import { jwt } from '../passport/passport'

const get = [getPosts]
const post = [
	jwt,
	validateImages,
	title,
	content,
	validateBody,
	validateFinal,
	createPost,
	uploadImages
]

const getId = [getPost]
const getIdComment = [getComments]
const postId = [jwt, content, validateBody, validateFinal, createComment]

const putId = [jwt, likePost]
const deleteId = [jwt, unlikePost]
const putIdComment = [jwt, likeComment]
const deleteIdComment = [jwt, unlikeComment]

const router = Router()

router.get('/', get)
router.post('/', post)

router.get('/:id', getId)
router.post('/:id', postId)

router.get('/:id', getId)
router.post('/:id/comment', getIdComment)
router.post('/:id', postId)

router.put('/:id/', putId)
router.delete('/:id/', deleteId)
router.put('/:id/:comment', putIdComment)
router.delete('/:id/:comment', deleteIdComment)

export default router
