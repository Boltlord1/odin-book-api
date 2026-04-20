import type { Request } from 'express'

const cookieExtractor = (req: Request) => {
	console.log(req.cookies?.access_token)
	return req.cookies?.access_token || null
}

export default cookieExtractor
