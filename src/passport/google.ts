import type { Request } from 'express'
import {
	type Profile,
	Strategy,
	type StrategyOptionsWithRequest,
	type VerifyCallback
} from 'passport-google-oauth20'
import prisma from '../lib/primsa'
import type { Unverified, Verified } from '../types/case'
import type { GoogleData } from '../types/data'
import type { UserWithIdentities } from '../types/prisma'

const clientID = `${process.env.GOOGLE_CLIENT_ID}`
const clientSecret = `${process.env.GOOGLE_SECRET}`

const options: StrategyOptionsWithRequest = {
	clientID,
	clientSecret,
	callbackURL: 'http://localhost:3000/auth/google/callback',
	passReqToCallback: true
}

const verifyCallback = async (
	req: Request,
	accessToken: string,
	refreshToken: string,
	profile: Profile,
	done: VerifyCallback
) => {
	const verified = await prisma.identity.findUnique({
		where: {
			providerId: {
				provider: 'Google',
				id: profile.id
			}
		}
	})

	if (verified) {
		const _case: Verified = {
			type: 'verified',
			id: verified.userId,
			provider: 'Google'
		}
		done(null, _case)
		return
	}

	const email = profile.emails ? profile.emails[0]?.value : null
	const fallbackEmail = profile._json.email
	const finalEmail = email || fallbackEmail
	if (!finalEmail) {
		done(new Error('Google account did not provide an email.'))
		return
	}

	const data: GoogleData = {
		email: finalEmail
	}

	const user = req.user as UserWithIdentities
	if (user) {
		const updated = await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				identities: {
					create: {
						provider: 'Google',
						id: profile.id,
						data
					}
				}
			}
		})

		const _case: Verified = {
			type: 'verified',
			id: updated.id,
			provider: 'Google'
		}
		done(null, _case)
		return
	}

	const avatar = profile.photos?.[0] ? profile.photos[0].value : ''
	const _case: Unverified = {
		type: 'unverified',
		id: profile.id,
		provider: 'Github',
		avatar,
		data
	}
	done(null, _case)
}

const strategy = new Strategy(options, verifyCallback)

export default strategy
