import type {
  Identity,
  Image,
  Message,
  User
} from '../../generated/prisma/client'

interface UserData {
  avatar: string | null
  display: string
  id: string
  name: string
}

interface UserExtraData extends UserData {
  followers: number
  following: number
  posts: number
}

interface ProfileData extends UserExtraData {
  followed: boolean
}

interface SelfData extends UserExtraData {
  identities: Identity[]
}

interface PostData {
  author: User
  comments: number
  content: string | null
  createdAt: Date
  id: string
  images: Image[]
  liked: boolean
  likes: number
  title: string
}

interface ReplyData {
  author: User
  content: string
  createdAt: Date
  id: string
  liked: boolean
  likes: number
}

interface CommentData extends ReplyData {
  replies: ReplyData[]
}

interface MessageData {
  content: string
  createdAt: Date
  id: string
  sent: boolean
}

interface ChatData {
  id: string
  messageCount: number
  messages: MessageData[]
  user: User
}

interface ChatDataMinimal {
  id: string
  message: Message | { content: string }
  messageCount: number
  user: User
}

export type {
  ChatData,
  ChatDataMinimal,
  CommentData,
  MessageData,
  PostData,
  ProfileData,
  ReplyData,
  SelfData,
  UserData,
  UserExtraData
}
