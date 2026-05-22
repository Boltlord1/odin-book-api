import { Router } from 'express'
import { uploadImages } from '../controllers/cloudinary'
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  searchPosts
} from '../controllers/post'
import {
  validateBody,
  validateFinal,
  validateImages
} from '../controllers/validate'
import { post, title } from '../lib/validator'
import { jwt, jwtOptional } from '../passport/passport'

const router = Router()

router.get('/', jwtOptional, searchPosts, getPosts)
router.post(
  '/',
  jwt,
  validateImages,
  title,
  post,
  validateBody,
  validateFinal,
  createPost,
  uploadImages
)

router.get('/:id', jwtOptional, getPost)
router.delete('/:id', jwt, deletePost)

export default router
