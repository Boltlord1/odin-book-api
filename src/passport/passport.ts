import passport from 'passport'
import { default as jwtStrategy } from './jwt'

passport.use(jwtStrategy)

export default passport
