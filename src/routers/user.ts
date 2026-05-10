import { Router } from 'express'
import { updateAvatar } from '../controllers/cloudinary'
import {
  getPosts,
  getSelf,
  getUser,
  getUsers,
  updateUser
} from '../controllers/user'
import { validateAvatar, validateFinal } from '../controllers/validate'
import { optional } from '../lib/validator'
import { jwt, jwtOptional } from '../passport/passport'

const router = Router()

router.get('/', jwtOptional, getUsers)
router.get('/self', jwt, getSelf)
router.put(
  '/',
  jwt,
  optional('username', 'Username'),
  optional('display', 'Display name'),
  updateUser
)
router.put('/avatar', jwt, validateAvatar, validateFinal, updateAvatar)

router.get('/:id', jwtOptional, getUser)
router.get('/:id/post', jwtOptional, getPosts)

export default router
