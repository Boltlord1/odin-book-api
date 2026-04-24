import type { Request } from 'express'

const cookieExtractor = (req: Request) => {
	return req.cookies?.access_token || null
}

export default cookieExtractor
