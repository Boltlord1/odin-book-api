import jsonWebToken from 'jsonwebtoken'
import type { Provider } from '../../generated/prisma/enums'
import type { OauthIdentity } from '../types/identity'
import type { LogInPayload, TempPayload } from '../types/temp'

const PRIV_KEY = `${process.env.PRIV_KEY}`.replace(/\\n/g, '\n')

function issueJwt(id: string) {
  const payload: LogInPayload = { type: 'login', id, iat: Date.now() }

  const token = jsonWebToken.sign(payload, PRIV_KEY, {
    expiresIn: '7d',
    algorithm: 'RS256'
  })

  return token
}

function issueTempJwt(
  id: string,
  avatar: string,
  data: OauthIdentity,
  provider: Provider
) {
  const payload: TempPayload = {
    type: 'temp',
    id,
    avatar,
    data,
    provider,
    iat: Date.now()
  }

  const token = jsonWebToken.sign(payload, PRIV_KEY, {
    expiresIn: '10m',
    algorithm: 'RS256'
  })

  return token
}

export { issueJwt, issueTempJwt }
