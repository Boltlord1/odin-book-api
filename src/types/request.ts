import type { Request } from 'express'
import type { ClientError, ServerError } from './error'

type ReqError = ClientError | ServerError

interface AvatarRequest extends Request {
	avatar?: string
}

interface UserIdRequest extends Request {
	userId?: string
}

interface PostRequest extends Request {
	postId?: string
}

interface ErrorRequest extends Request {
	sizeError?: ReqError | undefined
}

export type {
	AvatarRequest,
	ErrorRequest,
	PostRequest,
	ReqError,
	UserIdRequest
}
