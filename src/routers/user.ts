import { Router } from 'express'
import { updateAvatar } from '../controllers/cloudinary'
import {
  follow,
  getPosts,
  getSelf,
  getUser,
  unfollow,
  updateUser
} from '../controllers/user'
import { validateAvatar, validateFinal } from '../controllers/validate'
import { optional } from '../lib/validator'
import { jwt, jwtOptional } from '../passport/passport'

const get = [
  jwt,
  getSelf
]

const put = [
  jwt,
  optional('username', 'Username'),
  optional('display', 'Display name'),
  updateUser
]

const putAvatar = [
  jwt,
  validateAvatar,
  validateFinal,
  updateAvatar
]

const getId = [
  jwtOptional,
  getUser
]

const putId = [
  jwt,
  follow
]

const deleteId = [
  jwt,
  unfollow
]

const getIdPost = [
  jwtOptional,
  getPosts
]

const router = Router()

router.get('/', get)
router.put('/', put)
router.put('/avatar', putAvatar)

router.get('/:id', getId)
router.put('/:id', putId)
router.delete('/:id', deleteId)

router.get('/:id/post', getIdPost)

export default router
