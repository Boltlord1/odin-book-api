import type { Provider } from '../../generated/prisma/enums'
import type { OauthIdentity } from './prisma'

interface Base {
  id: string
  provider: Provider
}

interface Verified extends Base {
  type: 'verified'
}

interface Unverified extends Base {
  avatar: string
  data: OauthIdentity
  type: 'unverified'
}

type Case = Verified | Unverified

export type { Case, Unverified, Verified }
