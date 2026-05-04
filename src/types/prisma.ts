import type { Prisma } from '../../generated/prisma/client'

type UserWithIdentities = Prisma.UserGetPayload<{
  include: {
    identities: true
  }
}>
type PossibleUser = UserWithIdentities | undefined

type PostWithUserImagesAndCounts = Prisma.PostGetPayload<{
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

type CommentWithUserAndCounts = Prisma.CommentGetPayload<{
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

type UserWithIdentitiesAndCounts = Prisma.UserGetPayload<{
  include: {
    identities: true
    _count: {
      select: {
        posts: true
        followers: true
        follows: true
      }
    }
  }
}>

type UserWithCounts = Prisma.UserGetPayload<{
  include: {
    _count: {
      select: {
        posts: true
        followers: true
        follows: true
      }
    }
    followers: {
      where: {
        id: string
      }
    }
  }
}>

interface EmailIdentity {
  hash: string
  verified: boolean
}

interface GithubIdentity {
  url: string
  username: string
}

interface GoogleIdentity {
  email: string
}

type OauthIdentity = GithubIdentity | GoogleIdentity

export type {
  CommentWithUserAndCounts,
  EmailIdentity,
  GithubIdentity,
  GoogleIdentity,
  OauthIdentity,
  PossibleUser,
  PostWithUserImagesAndCounts,
  UserWithCounts,
  UserWithIdentities,
  UserWithIdentitiesAndCounts
}
