import {
  type WithSecretOrKey as Options,
  Strategy,
  type VerifiedCallback,
  type VerifyCallback
} from 'passport-jwt'
import { tempCookieExtractor } from '../lib/cookie'
import type { Payload } from '../types/temp'

const PUB_KEY = `${process.env.PUB_KEY}`.replace(/\\n/g, '\n')

const options: Options = {
  jwtFromRequest: tempCookieExtractor,
  secretOrKey: PUB_KEY,
  algorithms: ['RS256']
}

const verifyCallback: VerifyCallback = (
  payload: Payload,
  done: VerifiedCallback
) => {
  if (payload.type !== 'temp') {
    return done(null, false)
  }
  return done(null, payload)
}

const strategy = new Strategy(options, verifyCallback)
export default strategy
