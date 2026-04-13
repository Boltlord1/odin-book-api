import type { User as PrismaUser } from '../../generated/prisma/client'
import type { TempPayload } from '../lib/issueJwt'

type AuthenticatedUser = PrismaUser

interface Identity {
	id: string
	exists: boolean
}

declare global {
	namespace Express {
		interface User extends PrismaUser {}
		interface Request {
			identity: Identity
			payload: TempPayload
		}
	}
}
