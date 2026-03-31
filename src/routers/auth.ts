import { Router } from 'express'
import { createUser, logIn } from '../controllers/auth'
import { display, password, username } from '../lib/validator'

const router = Router()

router.post('/register', username, password, display, createUser)
router.post('/login', username, password, logIn)

export default router
