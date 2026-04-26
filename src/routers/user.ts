import { Router } from 'express'
import { getSelf, getUser, updateUser } from '../controllers/user'
import { parseAvatar, updateAvatar } from '../controllers/validation'
import { optional } from '../lib/validator'
import { standardOptions } from '../passport/options'
import passport from '../passport/passport'

const router = Router()

router.get('/', passport.authenticate('jwt', { session: false }), getSelf)
router.put(
	'/',
	passport.authenticate('jwt', { session: false }),
	optional('username', 'Username'),
	optional('display', 'Display name'),
	updateUser
)

router.put(
	'/avatar',
	passport.authenticate('jwt', standardOptions),
	parseAvatar,
	updateAvatar
)

router.get('/:name', passport.authenticate('jwt', { session: false }), getUser)

export default router
