import {
	type Profile,
	Strategy,
	type StrategyOptions,
	type VerifyCallback
} from 'passport-google-oauth20'
import type { User } from '../lib/interfaces'
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
	console.log(profile)
	console.log(profile.id)
	const existingUser = await prisma.oauthUser.findUnique({
		where: {
			providerId: {
				provider: 'google',
				id: profile.id
			}
		}
	})

	if (existingUser !== null) {
		const user: User = {
			id: existingUser.userId,
			exists: true
		}

		done(null, user)
		return
	}

	const user: User = {
		id: profile.id,
		exists: false
	}

	done(null, user)
}

const strategy = new Strategy(options, verifyCallback)

export default strategy
