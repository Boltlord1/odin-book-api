import type { Request } from 'express'

interface ReqError {
	type: 'client' | 'server'
	name: string
	msg: string
}

export type { ReqError }
