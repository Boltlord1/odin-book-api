import type { Provider } from '../../generated/prisma/enums'
import type { OauthIdentity } from './prisma'

interface LogInPayload {
  iat: number
  id: string
  type: 'login'
}

interface TempPayload {
  avatar: string
  data: OauthIdentity
  iat: number
  id: string
  provider: Provider
  type: 'temp'
}

type Payload = LogInPayload | TempPayload

export type { LogInPayload, Payload, TempPayload }
