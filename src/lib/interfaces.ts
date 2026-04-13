import type { Request } from 'express'

interface AvatarRequest extends Request {
	avatar?: string
}

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

export type { AvatarRequest, Identity, ReqError }
