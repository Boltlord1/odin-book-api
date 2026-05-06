import { Router } from 'express'
import {
  likeComment,
  likePost,
  likeReply,
  unlikeComment,
  unlikePost,
  unlikeReply
} from '../controllers/like'
import { jwt } from '../passport/passport'

const router = Router()

router.post('/post/:id', jwt, likePost)
router.delete('/post/:id', jwt, unlikePost)

router.post('/comment/:id', jwt, likeComment)
router.delete('/comment/:id', jwt, unlikeComment)

router.post('/reply/:id', jwt, likeReply)
router.delete('/reply/:id', jwt, unlikeReply)

export default router
