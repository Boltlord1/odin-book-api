import { Router } from 'express'
import { updateUser } from '../controllers/accounts'
import { getSelf, getUser } from '../controllers/user'
import { optional } from '../lib/validator'
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

router.get('/:name', passport.authenticate('jwt', { session: false }), getUser)

export default router
