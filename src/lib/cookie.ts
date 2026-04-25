import type { CookieOptions, Request } from 'express'

const cookieExtractor = (req: Request) => {
	return req.cookies?.access_token || null
}

const tempCookieExtractor = (req: Request) => {
	return req.cookies?.temp_token || null
}

const longOptions: CookieOptions = {
	httpOnly: true,
	secure: true,
	sameSite: 'none',
	maxAge: 1000 * 60 * 60 * 24 * 7
}

const tempOptions: CookieOptions = {
	...longOptions,
	maxAge: 1000 * 60 * 10
}

export { cookieExtractor, tempCookieExtractor, longOptions, tempOptions }
