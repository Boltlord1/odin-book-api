import type { Identity, Image, User } from '../../generated/prisma/client'

interface UserData {
  avatar: string
  display: string
  id: string
  name: string
}

interface ProfileData extends UserData {
  followed: boolean
  followers: number
  follows: number
  posts: number
}

interface SelfData extends UserData {
  followers: number
  follows: number
  identities: Identity[]
  posts: number
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

export type { CommentData, PostData, ProfileData, ReplyData, SelfData }
