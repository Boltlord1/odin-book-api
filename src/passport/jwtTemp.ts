import {
	ExtractJwt,
	type WithSecretOrKey as Options,
	Strategy,
	type VerifyCallback
} from 'passport-jwt'
import type { Payload } from '../lib/issueJwt'

const PUB_KEY = `${process.env.PUB_KEY}`.replace(/\\n/g, '\n')

const options: Options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: PUB_KEY,
	algorithms: ['RS256']
}

const verifyCallback: VerifyCallback = async (payload: Payload, done) => {
	if (payload.type !== 'temp') return done(null, false)
	return done(null, payload)
}

const strategy = new Strategy(options, verifyCallback)
export default strategy
