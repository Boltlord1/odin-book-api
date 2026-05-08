import type { ClientError, ServerError } from './error'

declare global {
  // biome-ignore lint/style/noNamespace: none
  namespace Express {
    interface Request {
      error: ServerError
      errors: ClientError[]
    }
  }
}
