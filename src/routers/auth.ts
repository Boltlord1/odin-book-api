import { Router } from 'express'
import {
	logIn,
	oauthCallback,
	oauthRegister,
	signIn,
	verify
} from '../controllers/auth'
import { createUser } from '../controllers/user'
import {
	parseAvatar,
	updateAvatar,
	uploadAuto,
	uploadAvatar,
	validateData
} from '../controllers/validation'
import { optional, password, required } from '../lib/validator'
import {
	callbackOptions,
	registerOptions,
	standardOptions
} from '../passport/options'
import passport from '../passport/passport'

const username = required('username', 'Username')
const display = optional('display', 'Display name')

const router = Router()

router.get('/verify', passport.authenticate('jwt', standardOptions), verify)

router.post(
	'/register',
	parseAvatar,
	username,
	password,
	display,
	validateData,
	createUser,
	uploadAvatar,
	signIn
)
router.post(
	'/login',
	username,
	required('password', 'Password', 1),
	validateData,
	logIn
)

router.get('/github', passport.authenticate('github', standardOptions))
router.get(
	'/github/callback',
	passport.authenticate('github', callbackOptions),
	oauthCallback('github')
)
router.post(
	'/github/register',
	passport.authenticate('jwt-temp', registerOptions),
	parseAvatar,
	username,
	display,
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
	parseAvatar,
	username,
	display,
	validateData,
	uploadAuto,
	oauthRegister('google')
)

router.put(
	'/avatar',
	passport.authenticate('jwt', standardOptions),
	parseAvatar,
	updateAvatar
)

export default router
