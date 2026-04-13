import { type Profile, Strategy, type StrategyOptions } from 'passport-github2'
import type { VerifyCallback, VerifyFunction } from 'passport-oauth2'
import type { Identity } from '../lib/interfaces'
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
