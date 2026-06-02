import type { Request } from 'express'
import {
  type Profile,
  Strategy,
  type StrategyOptionsWithRequest
} from 'passport-github2'
import type { VerifyCallback, VerifyFunctionWithRequest } from 'passport-oauth2'
import type { PossibleUser } from '../database/user'
import { ClientError } from '../lib/error'
import prisma from '../lib/primsa'
import type { Unverified, Verified } from '../types/case'
import type { GithubIdentity } from '../types/identity'

const clientID = `${process.env.GITHUB_CLIENT_ID}`
const clientSecret = `${process.env.GITHUB_SECRET}`

const options: StrategyOptionsWithRequest = {
  clientID,
  clientSecret,
  callbackURL: 'http://localhost:3000/auth/github/callback',
  passReqToCallback: true
}

const verifyCallback: VerifyFunctionWithRequest = async (
  req: Request,
  _accessToken: string,
  _refreshToken: string,
  profile: Profile,
  done: VerifyCallback
) => {
  const user = req.user as PossibleUser
  const verified = await prisma.identity.findUnique({
    where: { providerId: { provider: 'Github', id: profile.id } }
  })

  if (verified && user && verified.userId !== user.id) {
    const error = new ClientError(
      'connected',
      'Github profile is already connected to another account'
    )
    done(error)
    return
  }

  if (verified) {
    const _case: Verified = {
      type: 'verified',
      id: verified.userId,
      provider: 'Github'
    }
    done(null, _case)
    return
  }

  const username = profile.username
  if (!username) {
    const error = new ClientError(
      'profile',
      'Github profile did not provide username'
    )
    done(error)
    return
  }

  const avatar = profile.photos?.[0] ? profile.photos[0].value : ''
  const data: GithubIdentity = {
    username,
    url: profile.profileUrl,
    display: profile.displayName
  }

  if (user) {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        identities: { create: { provider: 'Github', id: profile.id, data } }
      }
    })

    const _case: Verified = {
      type: 'verified',
      id: updated.id,
      provider: 'Github'
    }
    done(null, _case)
    return
  }

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
