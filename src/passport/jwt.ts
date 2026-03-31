import {
	ExtractJwt,
	type WithSecretOrKey as Options,
	Strategy,
	type VerifyCallback
} from 'passport-jwt'
import prisma from '../lib/primsa'

const PUB_KEY = `${process.env.PUB_KEY}`.replace(/\\n/g, '\n')

const options: Options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: PUB_KEY,
	algorithms: ['RS256']
}

const verifyCallback: VerifyCallback = async (payload, done) => {
	const user = await prisma.user.findUnique({ where: { id: payload.sub } })
	if (user === null) return done(null, false)
	return done(null, user)
}

const strategy = new Strategy(options, verifyCallback)
export default strategy
