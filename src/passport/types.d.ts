import type { User as PrismaUser } from '../../generated/prisma/client'
import type { TempPayload } from '../lib/issueJwt'
import type { Identity } from '../lib/interfaces'

declare global {
	namespace Express {
		interface User extends PrismaUser {}
		interface Request {
			identity: Identity
			payload: TempPayload
		}
	}
}
