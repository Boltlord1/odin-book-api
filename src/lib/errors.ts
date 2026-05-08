import type { ClientError, ServerError } from '../types/error'

function clientError(name: string, msg: string) {
  const error: ClientError = { type: 'client', name, msg }

  return error
}

function serverError(msg: string) {
  const error: ServerError = { type: 'server', msg }

  return error
}

export { clientError, serverError }
