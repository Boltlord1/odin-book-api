import type { Request } from 'express'

interface ReqError {
	type: 'client' | 'server'
	name: string
	msg: string
}

interface Exists {
	id: string
	exists: true
}

interface NotExists {
	id: string
	avatar: string
	exists: false
}

type Identity = Exists | NotExists

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
	Identity,
	PostRequest,
	ReqError,
	UserIdRequest
}
