import { type Profile, Strategy, type StrategyOptions } from 'passport-github2'
import type { VerifyCallback, VerifyFunction } from 'passport-oauth2'
import type { User } from '../lib/interfaces'
import prisma from '../lib/primsa'

const clientID = `${process.env.GITHUB_CLIENT_ID}`
const clientSecret = `${process.env.GITHUB_SECRET}`

const options: StrategyOptions = {
	clientID,
	clientSecret,
	callbackURL: 'http://localhost:3000/auth/github/callback'
}

const verifyCallback: VerifyFunction = async (
	accessToken: string,
	requestToken: string,
	profile: Profile,
	done: VerifyCallback
) => {
	const existingUser = await prisma.oauthUser.findUnique({
		where: {
			providerId: {
				provider: 'github',
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
