import { Router } from 'express'
import { getUser } from '../controllers/user'
import passport from '../passport/passport'

const router = Router()

router.get('/:name', passport.authenticate('jwt', { session: false }), getUser)

export default router
