import { Router } from 'express'
import {
	createUser,
	logIn,
	oauthCallback,
	oauthRegister
} from '../controllers/auth'
import {
	parseForm,
	uploadAuto,
	uploadImage,
	validateData
} from '../controllers/validation'
import { display, password, username } from '../lib/validator'
import { callbackOptions, registerOptions } from '../passport/options'
import passport from '../passport/passport'

const router = Router()

router.post(
	'/register',
	parseForm,
	username,
	password,
	display('display'),
	validateData,
	uploadImage,
	createUser
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

export default router
