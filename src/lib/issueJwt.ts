import jsonWebToken from 'jsonwebtoken'

const PRIV_KEY = `${process.env.PRIV_KEY}`.replace(/\\n/g, '\n')

function issueJwt(id: string) {
	const payload = {
		sub: id,
		iat: Date.now()
	}

	const expiresIn = '7d'
	const token = jsonWebToken.sign(payload, PRIV_KEY, {
		expiresIn,
		algorithm: 'RS256'
	})

	return {
		token: `Bearer ${token}`,
		expires: expiresIn
	}
}

export default issueJwt
