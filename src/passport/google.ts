import {
	type Profile,
	Strategy,
	type StrategyOptions,
	type VerifyCallback
} from 'passport-google-oauth20'
import type { Identity } from '../lib/interfaces'
import prisma from '../lib/primsa'

const clientID = `${process.env.GOOGLE_CLIENT_ID}`
const clientSecret = `${process.env.GOOGLE_SECRET}`

const options: StrategyOptions = {
	clientID,
	clientSecret,
	callbackURL: 'http://localhost:3000/auth/google/callback'
}

const verifyCallback = async (
	accessToken: string,
	refreshToken: string,
	profile: Profile,
	done: VerifyCallback
) => {
	const existingUser = await prisma.oauthUser.findUnique({
		where: {
			providerId: {
				provider: 'google',
				id: profile.id
			}
		}
	})

	if (existingUser !== null) {
		const identity: Identity = {
			id: existingUser.userId,
			exists: true
		}

		done(null, identity as unknown as Express.User)
		return
	}

	const avatar = profile.photos?.[0] ? profile.photos[0].value : 'default'
	const identity: Identity = {
		id: profile.id,
		avatar,
		exists: false
	}

	done(null, identity as unknown as Express.User)
}

const strategy = new Strategy(options, verifyCallback)

export default strategy
