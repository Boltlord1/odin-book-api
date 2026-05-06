import type { ClientError, ServerError } from './error'

declare global {
  // biome-ignore lint/style/noNamespace: <explanation>
  namespace Express {
    interface Request {
      error: ServerError
      errors: ClientError[]
    }
  }
}
