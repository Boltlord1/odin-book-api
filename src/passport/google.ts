import type { Request } from 'express'
import {
  type Profile,
  Strategy,
  type StrategyOptionsWithRequest,
  type VerifyCallback
} from 'passport-google-oauth20'
import type { PossibleUser } from '../database/user'
import { serverError } from '../lib/errors'
import prisma from '../lib/primsa'
import type { Unverified, Verified } from '../types/case'
import type { GoogleIdentity } from '../types/identity'

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
  _accessToken: string,
  _refreshToken: string,
  profile: Profile,
  done: VerifyCallback
) => {
  const user = req.user as PossibleUser
  const verified = await prisma.identity.findUnique({
    where: { providerId: { provider: 'Google', id: profile.id } }
  })

  if (verified && user && verified.userId !== user.id) {
    const error = serverError(
      'Google account is already connected to another account'
    )
    done(error)
    return
  }
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
    const error = serverError('Google account did not provide an email')
    done(error)
    return
  }

  const data: GoogleIdentity = {
    email: finalEmail,
    display: profile.displayName
  }

  if (user) {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        identities: { create: { provider: 'Google', id: profile.id, data } }
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
    provider: 'Google',
    avatar,
    data
  }
  done(null, _case)
}

const strategy = new Strategy(options, verifyCallback)

export default strategy
