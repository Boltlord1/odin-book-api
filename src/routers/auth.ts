import { Router } from 'express'
import { createUser, logIn } from '../controllers/auth'
import { display, password, username } from '../lib/validator'
import passport from '../passport/passport'

const router = Router()

router.post('/register', username, password, display, createUser)
router.post('/login', username, password, logIn)
router.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		res.json(true)
	}
)

export default router
