import type { Prisma } from '../../generated/prisma/client'

interface FollowParam {
  followerCount: number
  followers: unknown[]
}

export const refineFollow = <T extends FollowParam>(obj: T) => {
  const { followers, ...rest } = obj
  const followed = !!followers.length
  const followerCount = rest.followerCount - Number(followed)
  return { ...rest, followed, followerCount }
}

interface LikeParam {
  likeCount: number
  likedBy: unknown[]
}

export const refineLike = <T extends LikeParam>(obj: T) => {
  const { likedBy, ...rest } = obj
  const liked = !!likedBy.length
  const likeCount = obj.likeCount - Number(liked)
  return { ...rest, liked, likeCount }
}

type CommentData = Prisma.CommentGetPayload<{
  include: { author: true; likedBy: true; children: true }
}>

type RefinedComment = Omit<CommentData, 'likedBy' | 'children'> & {
  liked: boolean
  children: RefinedComment[]
}

export const refineComment = (obj: CommentData): RefinedComment => {
  const { children, likedBy, ...rest } = obj

  const refinedChildren = children
    ? children.map((c) => refineComment(c as CommentData))
    : []

  const liked = !!likedBy.length
  const likeCount = obj.likeCount - Number(liked)

  return { ...rest, liked, likeCount, children: refinedChildren }
}

interface MessageParam {
  messages?: unknown[]
  users: unknown[]
}

export const refineChat = <T extends MessageParam>(obj: T) => {
  const { users, messages, ...rest } = obj
  const message = messages ? messages[0] : null
  const user = users[0]
  return { ...rest, message, user }
}
