import type { Message } from '../../generated/prisma/client'
import type {
  ChatData,
  ChatDataMinimal,
  CommentData,
  MessageData,
  PostData,
  ProfileData,
  ReplyData,
  SelfData,
  UserExtraData
} from '../types/data'
import type {
  RawChat,
  RawComment,
  RawPost,
  RawProfile,
  RawReply,
  RawSelf,
  RawUser
} from '../types/prisma'

const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    result[key] = obj[key]
  }
  return result
}

const refinePost = (raw: RawPost): PostData => ({
  ...pick(raw, ['author', 'content', 'createdAt', 'id', 'images', 'title']),
  comments: raw._count.comments,
  liked: raw.likedBy.length > 0,
  likes: raw._count.likedBy
})

const refineComment = (raw: RawComment): CommentData => ({
  ...pick(raw, ['author', 'content', 'createdAt', 'id']),
  liked: raw.likedBy.length > 0,
  likes: raw._count.likedBy,
  replies: raw.replies.map(refineReply)
})

const refineReply = (raw: RawReply): ReplyData => ({
  ...pick(raw, ['author', 'content', 'createdAt', 'id']),
  liked: raw.likedBy.length > 0,
  likes: raw._count.likedBy
})

const refineSelf = (raw: RawSelf): SelfData => {
  const refined: SelfData = {
    ...pick(raw, ['avatar', 'display', 'id', 'identities', 'name']),
    posts: raw._count.posts,
    followers: raw._count.followers,
    following: raw._count.following
  }

  for (const identity of refined.identities) {
    if (identity.provider === 'Email') {
      const data = identity.data
      data.hash = undefined
    }
  }

  return refined
}

const refineUser = (raw: RawUser): UserExtraData => ({
  ...pick(raw, ['avatar', 'display', 'id', 'name']),
  followers: raw._count.followers,
  following: raw._count.following,
  posts: raw._count.posts
})

const refineProfile = (raw: RawProfile): ProfileData => ({
  ...pick(raw, ['avatar', 'display', 'id', 'name']),
  posts: raw._count.posts,
  followers: raw._count.followers,
  following: raw._count.following,
  followed: raw.followers.length > 0
})

const refineMessage = (
  raw: Message,
  id: string,
  bool = false
): MessageData => ({
  ...pick(raw, ['content', 'createdAt', 'id']),
  sent: (raw.authorId === id) === bool
})

const refineChat = (raw: RawChat): ChatData | null => {
  const user = raw.users[0]
  if (!user) {
    return null
  }

  return {
    ...pick(raw, ['id']),
    messageCount: raw._count.messages,
    messages: raw.messages.map((m) => refineMessage(m, user.id)),
    user
  }
}

const refineChatMinimal = (raw: RawChat): ChatDataMinimal | null => {
  const user = raw.users[0]
  const message = raw.messages[0]
  if (!(user && message)) {
    return null
  }

  return {
    ...pick(raw, ['id']),
    messageCount: raw._count.messages,
    message: refineMessage(message, user.id),
    user
  }
}

export {
  refineChat,
  refineChatMinimal,
  refineComment,
  refineMessage,
  refinePost,
  refineProfile,
  refineReply,
  refineSelf,
  refineUser
}
