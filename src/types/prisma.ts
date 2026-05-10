import type { Prisma } from '../../generated/prisma/client'

type UserWithIdentities = Prisma.UserGetPayload<{
  include: { identities: true }
}>
type PossibleUser = UserWithIdentities | undefined

type RawPost = Prisma.PostGetPayload<{
  include: {
    images: true
    author: true
    _count: { select: { comments: true; likedBy: true } }
    likedBy: true
  }
}>

type RawCommentWithoutReplies = Prisma.CommentGetPayload<{
  include: {
    author: true
    likedBy: true
    _count: { select: { likedBy: true } }
  }
}>

interface RawComment extends RawCommentWithoutReplies {
  replies: RawReply[]
}

type RawReply = Prisma.ReplyGetPayload<{
  include: {
    author: true
    likedBy: true
    _count: { select: { likedBy: true } }
  }
}>

type RawUser = Prisma.UserGetPayload<{
  include: {
    _count: { select: { posts: true; followers: true; following: true } }
  }
}>

type RawSelf = Prisma.UserGetPayload<{
  include: {
    identities: true
    _count: { select: { posts: true; followers: true; following: true } }
  }
}>

type RawProfile = Prisma.UserGetPayload<{
  include: {
    _count: { select: { posts: true; followers: true; following: true } }
    followers: { where: { id: string } }
  }
}>

type RawChat = Prisma.ChatGetPayload<{
  include: {
    users: true
    messages: true
    _count: { select: { messages: true } }
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
  EmailIdentity,
  GithubIdentity,
  GoogleIdentity,
  OauthIdentity,
  PossibleUser,
  RawChat,
  RawComment,
  RawPost,
  RawProfile,
  RawReply,
  RawSelf,
  RawUser,
  UserWithIdentities
}
