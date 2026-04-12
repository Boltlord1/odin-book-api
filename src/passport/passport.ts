import passport from 'passport'
import { default as githubStrategy } from './github'
import { default as googleStrategy } from './google'
import { default as jwtStrategy } from './jwt'
import { default as jwtTempStrategy } from './jwtTemp'

passport.use(githubStrategy)
passport.use(googleStrategy)
passport.use('jwt', jwtStrategy)
passport.use('jwt-temp', jwtTempStrategy)

export default passport
