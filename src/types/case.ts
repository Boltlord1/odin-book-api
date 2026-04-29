import type { Provider } from '../../generated/prisma/enums'
import type { OauthData } from './data'

interface Base {
	id: string
	provider: Provider
}

interface Verified extends Base {
	type: 'verified'
}

interface Unverified extends Base {
	type: 'unverified'
	avatar: string
	data: OauthData
}

type Case = Verified | Unverified

export type { Case, Unverified, Verified }
