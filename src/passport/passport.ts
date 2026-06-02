import type { RequestHandler } from 'express'
import pass from 'passport'
import type { PossibleUser } from '../database/user'
import parseQuery from '../routers/query'
import githubStrategy from './github'
import googleStrategy from './google'
import jwtStrategy from './jwt'
import jwtTempStrategy from './jwtTemp'

const passport = pass

passport.use(githubStrategy)
passport.use(googleStrategy)
passport.use('jwt', jwtStrategy)
passport.use('jwt-temp', jwtTempStrategy)

const jwt = passport.authenticate('jwt', { session: false })
const jwtTemp = passport.authenticate('jwt-temp', { session: false })

const google: RequestHandler = (req, res, next) => {
  const path = parseQuery(req.query.path) || '/auth/login'
  passport.authenticate('google', {
    session: false,
    scope: ['email', 'profile'],
    state: path
  })(req, res, next)
}

const github: RequestHandler = (req, res, next) => {
  const path = parseQuery(req.query.path) || '/auth/login'
  passport.authenticate('github', { session: false, state: path })(
    req,
    res,
    next
  )
}

const jwtOptional: RequestHandler = (req, res, next) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (_err: unknown, user: PossibleUser) => {
      if (user) {
        req.user = user
      }
      next()
    }
  )(req, res, next)
}

export default passport
export { github, google, jwt, jwtOptional, jwtTemp }
