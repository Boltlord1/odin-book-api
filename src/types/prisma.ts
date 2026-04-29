import type { Prisma } from '../../generated/prisma/client'

type UserWithIdentities = Prisma.UserGetPayload<{
	include: { identities: true }
}>

interface EmailIdentity {
	hash: string
	verified: boolean
}

interface GithubIdentity {
	username: string
	url: string
}

interface GoogleIdentity {
	email: string
}

type OauthIdentity = GithubIdentity | GoogleIdentity

export type { EmailIdentity, GithubIdentity, GoogleIdentity, OauthIdentity, UserWithIdentities }
