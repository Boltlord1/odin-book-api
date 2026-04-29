interface ClientError {
	type: 'client'
	name: string
	msg: string
}

interface ServerError {
	type: 'server'
	msg: string
}

export type { ClientError, ServerError }
