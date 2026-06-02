import type { Request } from 'express'

interface AvatarRequest extends Request {
  avatar?: string
}

interface UserIdRequest extends Request {
  userId?: string
}

interface PostRequest extends Request {
  postId?: string
}

export type { AvatarRequest, PostRequest, UserIdRequest }
