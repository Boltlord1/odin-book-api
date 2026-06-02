import { Router } from 'express'
import { updateAvatar } from '../controllers/cloudinary'
import { checkUsername, getSelf, updateNames } from '../controllers/self'
import { getPosts, getProfile, getSearch, getUsers } from '../controllers/user'
import { validateAvatar, validateFinal } from '../controllers/validate'
import { optional } from '../lib/validator'
import { jwt, jwtOptional } from '../passport/passport'

const router = Router()

router.get('/', jwtOptional, getSearch, getUsers)
router.get('/self', jwt, getSelf)
router.get('/name', checkUsername)
router.put(
  '/',
  jwt,
  validateAvatar,
  optional('username', 'Username'),
  optional('display', 'Display name'),
  validateFinal,
  updateAvatar,
  updateNames
)

router.get('/:id', jwtOptional, getProfile)
router.get('/:id/post', jwtOptional, getPosts)

export default router
