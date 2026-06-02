import { Router } from 'express'
import { uploadImages } from '../controllers/cloudinary'
import {
  delPost,
  getPost,
  getPosts,
  getSearch,
  postPost
} from '../controllers/post'
import {
  validateBody,
  validateFinal,
  validateImages
} from '../controllers/validate'
import { post, title } from '../lib/validator'
import { jwt, jwtOptional } from '../passport/passport'

const router = Router()

router.get('/', jwtOptional, getSearch, getPosts)
router.post(
  '/',
  jwt,
  validateImages,
  title,
  post,
  validateBody,
  validateFinal,
  postPost,
  uploadImages
)

router.get('/:id', jwtOptional, getPost)
router.delete('/:id', jwt, delPost)

export default router
