import {
  type WithSecretOrKey as Options,
  Strategy,
  type VerifyCallback
} from 'passport-jwt'
import { cookieExtractor } from '../lib/cookie'
import prisma from '../lib/primsa'
import type { Payload } from '../types/temp'

const PUB_KEY = `${process.env.PUB_KEY}`.replace(/\\n/g, '\n')

const options: Options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: PUB_KEY,
  algorithms: [
    'RS256'
  ]
}

const verifyCallback: VerifyCallback = async (payload: Payload, done) => {
  if (payload.type !== 'login') {
    return done(null, false)
  }
  const user = await prisma.user.findUnique({
    where: {
      id: payload.id
    },
    include: {
      identities: true
    }
  })
  if (user === null) {
    return done(null, false)
  }
  return done(null, user)
}

const strategy = new Strategy(options, verifyCallback)
export default strategy
