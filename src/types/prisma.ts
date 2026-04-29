import type { Prisma } from '../../generated/prisma/client'

type UserWithIdentities = Prisma.UserGetPayload<{
	include: { identities: true }
}>

export type { UserWithIdentities }
