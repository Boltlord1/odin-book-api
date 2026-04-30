import type { Prisma } from '../../generated/prisma/client'

type UserWithIdentities = Prisma.UserGetPayload<{
	include: { identities: true }
}>
type PossibleUser = UserWithIdentities | undefined

type PostWithUserImagesAndLikes = Prisma.PostGetPayload<{
	include: {
		images: true
		author: true
		_count: {
			select: {
				comments: true
				likedBy: true
			}
		}
		likedBy: true
	}
}>

type CommentWithUserAndLikes = Prisma.CommentGetPayload<{
	include: {
		author: true
		likedBy: true
		_count: {
			select: {
				likedBy: true
			}
		}
	}
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

export type {
	CommentWithUserAndLikes,
	EmailIdentity,
	GithubIdentity,
	GoogleIdentity,
	OauthIdentity,
	PossibleUser,
	PostWithUserImagesAndLikes,
	UserWithIdentities
}
