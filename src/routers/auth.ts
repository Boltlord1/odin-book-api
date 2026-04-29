import { Router } from 'express'
import {
	addEmail,
	logIn,
	logOut,
	oauthCallback,
	oauthRegister,
	optionalJwt,
	signIn,
	verify
} from '../controllers/auth'
import { createUser } from '../controllers/user'
import {
	parseAvatar,
	uploadAuto,
	uploadAvatar,
	validateData
} from '../controllers/validation'
import { email, optional, password, required } from '../lib/validator'
import { standardOptions } from '../passport/options'
import passport from '../passport/passport'

const username = required('username', 'Username')
const display = optional('display', 'Display name')

const router = Router()

router.get('/verify', passport.authenticate('jwt', standardOptions), verify)

router.post(
	'/register',
	parseAvatar,
	username,
	display,
	email,
	password,
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
router.get('/logout', logOut)

router.get('/github', passport.authenticate('github', standardOptions))
router.get(
	'/github/callback',
	optionalJwt,
	passport.authenticate('github', standardOptions),
	oauthCallback('Github')
)
router.post(
	'/github/register',
	passport.authenticate('jwt-temp', standardOptions),
	parseAvatar,
	username,
	display,
	validateData,
	uploadAuto,
	oauthRegister('Github')
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
	optionalJwt,
	passport.authenticate('google', standardOptions),
	oauthCallback('Google')
)
router.post(
	'/google/register',
	passport.authenticate('jwt-temp', standardOptions),
	parseAvatar,
	username,
	display,
	validateData,
	uploadAuto,
	oauthRegister('Google')
)

router.post(
	'/email',
	passport.authenticate('jwt', standardOptions),
	email,
	password,
	validateData,
	addEmail
)

export default router
