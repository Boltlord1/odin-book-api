import { Router } from 'express'
import { changeLike } from '../controllers/like'
import { jwt } from '../passport/passport'

const router = Router()

router.post('/post/:id', jwt, changeLike('post', 'connect'))
router.delete('/post/:id', jwt, changeLike('post', 'disconnect'))

router.post('/comment/:id', jwt, changeLike('comment', 'connect'))
router.delete('/comment/:id', jwt, changeLike('comment', 'disconnect'))

export default router
