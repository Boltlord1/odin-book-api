import { Router } from 'express'
import { follow, unfollow } from '../controllers/follow'
import { standardOptions } from '../passport/options'
import passport from '../passport/passport'

const router = Router()

router.post('/:id', passport.authenticate('jwt', standardOptions), follow)
router.delete('/:id', passport.authenticate('jwt', standardOptions), unfollow)

export default router
