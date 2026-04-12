import { Router } from 'express'
import { getSelf, updateUser } from '../controllers/accounts'
import { getUser } from '../controllers/user'
import { display } from '../lib/validator'
import passport from '../passport/passport'

const router = Router()

router.get('/', passport.authenticate('jwt', { session: false }), getSelf)
router.put(
	'/',
	passport.authenticate('jwt', { session: false }),
	display('username'),
	display('display'),
	updateUser
)

router.get('/:name', passport.authenticate('jwt', { session: false }), getUser)

export default router
