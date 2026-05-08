import type { Message, User } from '../../generated/prisma/client'
import type {
  ChatData,
  ChatDataMinimal,
  CommentData,
  MessageData,
  PostData,
  ProfileData,
  ReplyData,
  SelfData
} from '../types/data'
import type {
  RawChat,
  RawComment,
  RawPost,
  RawProfile,
  RawReply,
  RawSelf
} from '../types/prisma'

function refinePost(raw: RawPost) {
  const refined: PostData = {
    ...raw,
    comments: raw._count.comments,
    likes: raw._count.likedBy,
    liked: raw.likedBy.length > 0
  }

  return refined
}

function refineComment(raw: RawComment) {
  const refined: CommentData = {
    ...raw,
    likes: raw._count.likedBy,
    liked: raw.likedBy.length > 0,
    replies: raw.replies.map(refineReply)
  }

  return refined
}

function refineReply(raw: RawReply) {
  const refined: ReplyData = {
    ...raw,
    likes: raw._count.likedBy,
    liked: raw.likedBy.length > 0
  }

  return refined
}

function refineSelf(raw: RawSelf) {
  const refined: SelfData = {
    ...raw,
    posts: raw._count.posts,
    followers: raw._count.followers,
    follows: raw._count.follows
  }

  for (const identity of refined.identities) {
    if (identity.provider === 'Email') {
      const data = identity.data
      data.hash = undefined
    }
  }

  return refined
}

function refineUser(raw: RawProfile) {
  const refined: ProfileData = {
    ...raw,
    posts: raw._count.posts,
    followers: raw._count.followers,
    follows: raw._count.follows,
    followed: raw.followers.length > 0
  }

  return refined
}

function refineMessage(raw: Message, id: string, bool = false) {
  const sent = raw.authorId === id
  const refined: MessageData = {
    id: raw.id,
    createdAt: raw.createdAt,
    content: raw.content,
    sent: sent === bool
  }

  return refined
}

function refineChat(raw: RawChat) {
  const user = raw.users[0] as User
  const refined: ChatData = {
    id: raw.id,
    messageCount: raw._count.messages,
    messages: raw.messages.map(m => refineMessage(m, user.id)),
    user
  }

  return refined
}

function refineChatMinimal(raw: RawChat) {
  const user = raw.users[0] as User
  const message = raw.messages[0] as Message
  const refined: ChatDataMinimal = {
    id: raw.id,
    message: refineMessage(message, user.id),
    messageCount: raw._count.messages,
    user
  }

  return refined
}

export {
  refineChat,
  refineChatMinimal,
  refineComment,
  refineMessage,
  refinePost,
  refineReply,
  refineSelf,
  refineUser
}
