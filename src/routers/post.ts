import { Router } from 'express'
import { uploadImages } from '../controllers/cloudinary'
import {
  createComment,
  createPost,
  getComments,
  getPost,
  getPosts,
  likeComment,
  likePost,
  unlikeComment,
  unlikePost
} from '../controllers/post'
import {
  validateBody,
  validateFinal,
  validateImages
} from '../controllers/validate'
import { comment, content, title } from '../lib/validator'
import { jwt, jwtOptional } from '../passport/passport'

const router = Router()

router.get('/', jwtOptional, getPosts)
router.post(
  '/',
  jwt,
  validateImages,
  title,
  content,
  validateBody,
  validateFinal,
  createPost,
  uploadImages
)

router.get('/:id', jwtOptional, getPost)
router.get('/:id/comment', jwtOptional, getComments)
router.post('/:id', jwt, comment, validateBody, validateFinal, createComment)

router.post('/:id/like', jwt, likePost)
router.delete('/:id/like', jwt, unlikePost)
router.post('/:id/like/:comment', jwt, likeComment)
router.delete('/:id/like/:comment', jwt, unlikeComment)

export default router
