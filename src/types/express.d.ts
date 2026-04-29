import type { ClientError, ServerError } from './error'

declare global {
	namespace Express {
		interface Request {
			errors: ClientError[]
			error: ServerError
		}
	}
}
