import jsonWebToken from 'jsonwebtoken'
import type { Provider } from '../../generated/prisma/enums'

const PRIV_KEY = `${process.env.PRIV_KEY}`.replace(/\\n/g, '\n')

function issueJwt(id: string) {
	const payload = {
		sub: id,
		type: 'login',
		iat: Date.now()
	}

	const token = jsonWebToken.sign(payload, PRIV_KEY, {
		expiresIn: '7d',
		algorithm: 'RS256'
	})

	return {
		token: `Bearer ${token}`,
		expires: '7d'
	}
}

function issueTempJwt(id: string, avatar: string, provider: Provider) {
	console.log(avatar)
	const payload = {
		sub: id,
		avatar,
		type: 'temp',
		provider,
		iat: Date.now()
	}

	const token = jsonWebToken.sign(payload, PRIV_KEY, {
		expiresIn: '10m',
		algorithm: 'RS256'
	})

	return {
		token: `Bearer ${token}`,
		expires: '10m'
	}
}

interface LoginPayload {
	sub: string
	type: 'login'
	iat: number
}

interface TempPayload {
	sub: string
	avatar: string
	type: 'temp'
	provider: Provider
	iat: number
}

type Payload = LoginPayload | TempPayload

export type { LoginPayload, Payload, TempPayload }
export { issueJwt, issueTempJwt }
