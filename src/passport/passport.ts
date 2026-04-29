import type { RequestHandler } from 'express'
import passport from 'passport'
import type { UserWithIdentities } from '../types/prisma'
import githubStrategy from './github'
import googleStrategy from './google'
import jwtStrategy from './jwt'
import jwtTempStrategy from './jwtTemp'

passport.use(githubStrategy)
passport.use(googleStrategy)
passport.use('jwt', jwtStrategy)
passport.use('jwt-temp', jwtTempStrategy)

const jwt = passport.authenticate('jwt', { session: false })
const jwtTemp = passport.authenticate('jwt-temp', { session: false })

const google = passport.authenticate('google', {
	session: false,
	scope: ['email', 'profile']
})
const github = passport.authenticate('github-temp', { session: false })

const jwtOptional: RequestHandler = (req, res, next) => {
	passport.authenticate(
		'jwt',
		{ session: false },
		(_err: unknown, user: UserWithIdentities) => {
			if (user) {
				req.user = user
			}
			next()
		}
	)(req, res, next)
}

export default passport
export { github, google, jwt, jwtOptional, jwtTemp }
