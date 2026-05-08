import { Router } from 'express'
import authRouter from './auth'
import chatRouter from './chat'
import commentRouter from './comment'
import followRouter from './follow'
import likeRouter from './like'
import postRouter from './post'
import replyRouter from './reply'
import userRouter from './user'

const router = Router()

router.use('/auth', authRouter)
router.use('/chat', chatRouter)
router.use('/comment', commentRouter)
router.use('/follow', followRouter)
router.use('/like', likeRouter)
router.use('/post', postRouter)
router.use('/reply', replyRouter)
router.use('/user', userRouter)

export default router
