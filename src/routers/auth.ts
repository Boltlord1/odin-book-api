import { Router } from 'express'
import {
	logIn,
	oauthCallback,
	oauthRegister,
	signIn
} from '../controllers/auth'
import { createUser } from '../controllers/user'
import {
	parseForm,
	updateAvatar,
	uploadAuto,
	uploadAvatar,
	validateData
} from '../controllers/validation'
import { display, password, username } from '../lib/validator'
import {
	callbackOptions,
	registerOptions,
	standardOptions
} from '../passport/options'
import passport from '../passport/passport'

const router = Router()

router.post(
	'/register',
	parseForm,
	username,
	password,
	display('display'),
	validateData,
	createUser,
	uploadAvatar,
	signIn
)
router.post('/login', username, password, validateData, logIn)

router.get('/github', passport.authenticate('github', { session: false }))
router.get(
	'/github/callback',
	passport.authenticate('github', callbackOptions),
	oauthCallback('github')
)
router.post(
	'/github/register',
	passport.authenticate('jwt-temp', registerOptions),
	parseForm,
	username,
	display('display'),
	validateData,
	uploadAuto,
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
	passport.authenticate('google', callbackOptions),
	oauthCallback('google')
)
router.post(
	'/google/register',
	passport.authenticate('jwt-temp', registerOptions),
	parseForm,
	username,
	display('display'),
	validateData,
	uploadAuto,
	oauthRegister('google')
)

router.put(
	'/avatar',
	passport.authenticate('jwt', standardOptions),
	parseForm,
	updateAvatar
)

export default router
