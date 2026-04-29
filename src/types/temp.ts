import type { Provider } from '../../generated/prisma/enums'
import type { OauthIdentity } from './prisma'

interface LogInPayload {
	type: 'login'
	id: string
	iat: number
}

interface TempPayload {
	type: 'temp'
	id: string
	avatar: string
	provider: Provider
	data: OauthIdentity
	iat: number
}

type Payload = LogInPayload | TempPayload

export type { LogInPayload, Payload, TempPayload }
