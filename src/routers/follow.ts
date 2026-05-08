import { Router } from 'express'
import {
  follow,
  getFollowers,
  getFollowing,
  unfollow
} from '../controllers/follow'
import { jwt, jwtOptional } from '../passport/passport'

const router = Router()

router.get('/:id/following', jwtOptional, getFollowing)
router.get('/:id/followers', jwtOptional, getFollowers)

router.post('/:id', jwt, follow)
router.delete('/:id', jwt, unfollow)

export default router
