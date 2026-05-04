interface ClientError {
  msg: string
  name: string
  type: 'client'
}

interface ServerError {
  msg: string
  type: 'server'
}

export type { ClientError, ServerError }
