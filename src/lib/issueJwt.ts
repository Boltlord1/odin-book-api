import jsonWebToken from 'jsonwebtoken'
import type { Provider } from '../../generated/prisma/enums'
import type { OauthData } from '../types/data'
import type { LoginPayload, TempPayload } from '../types/temp'

const PRIV_KEY = `${process.env.PRIV_KEY}`.replace(/\\n/g, '\n')

function issueJwt(id: string) {
	const payload: LoginPayload = {
		type: 'login',
		id,
		iat: Date.now()
	}

	const token = jsonWebToken.sign(payload, PRIV_KEY, {
		expiresIn: '7d',
		algorithm: 'RS256'
	})

	return token
}

function issueTempJwt(
	id: string,
	avatar: string,
	data: OauthData,
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
