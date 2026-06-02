import type { ErrorRequestHandler } from 'express'
import { ClientError } from '../lib/error'
import { FRONTEND_URL } from '../lib/variables'

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err)
    return
  }

  if (err instanceof ClientError) {
    const path = req.query.state as string
    if (err.name === 'connected') {
      res.redirect(`${FRONTEND_URL + path}?error=${err.msg}`)
    }
    if (err.name === 'profile') {
      res.redirect(`${FRONTEND_URL + path}?error=${err.msg}`)
    }
  }
}
