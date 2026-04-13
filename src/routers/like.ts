import { Router } from 'express'
import { changeLike } from '../controllers/like'
import { standardOptions } from '../passport/options'
import passport from '../passport/passport'

const router = Router()

router.post(
	'/post/:id',
	passport.authenticate('jwt', standardOptions),
	changeLike('post', 'connect')
)
router.delete(
	'/post/:id',
	passport.authenticate('jwt', standardOptions),
	changeLike('post', 'disconnect')
)

router.post(
	'/comment/:id',
	passport.authenticate('jwt', standardOptions),
	changeLike('comment', 'connect')
)
router.delete(
	'/comment/:id',
	passport.authenticate('jwt', standardOptions),
	changeLike('comment', 'disconnect')
)

export default router
