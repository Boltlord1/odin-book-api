import { Router } from 'express'
import {
	createUser,
	logIn,
	oauthCallback,
	oauthRegister
} from '../controllers/auth'
import { display, password, username } from '../lib/validator'
import passport from '../passport/passport'

const router = Router()

router.post('/register', username, password, display('display'), createUser)
router.post('/login', username, password, logIn)

router.get('/github', passport.authenticate('github', { session: false }))
router.get(
	'/github/callback',
	passport.authenticate('github', { session: false }),
	oauthCallback('github')
)
router.post(
	'/github/register',
	passport.authenticate('jwt-temp', { session: false }),
	username,
	display('display'),
	oauthRegister('github')
)

router.get(
	'/google',
	passport.authenticate('google', {
		session: false,
		scope: ['profile', 'email']
	})
)
router.get(
	'/google/callback',
	passport.authenticate('google', { session: false }),
	oauthCallback('google')
)
router.post(
	'/google/register',
	passport.authenticate('jwt-temp', { session: false }),
	username,
	display('display'),
	oauthRegister('google')
)

export default router
