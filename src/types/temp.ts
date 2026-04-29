import type { Provider } from '../../generated/prisma/enums'
import type { OauthData } from './data'

interface LoginPayload {
	type: 'login'
	id: string
	iat: number
}

interface TempPayload {
	type: 'temp'
	id: string
	avatar: string
	provider: Provider
	data: OauthData
	iat: number
}

type Payload = LoginPayload | TempPayload

export type { LoginPayload, Payload, TempPayload }
