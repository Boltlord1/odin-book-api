import { Router } from 'express'
import { logIn, logOut, signIn, verify } from '../controllers/auth'
import { uploadAuto, uploadAvatar } from '../controllers/cloudinary'
import {
  githubCallback,
  githubSignUp,
  googleCallback,
  googleSignUp
} from '../controllers/oauth'
import { connectEmail, postUser } from '../controllers/self'
import {
  validateAvatar,
  validateBody,
  validateFinal,
  validateForm
} from '../controllers/validate'
import { display, email, password, required, username } from '../lib/validator'
import { github, google, jwt, jwtOptional, jwtTemp } from '../passport/passport'

const router = Router()

router.get('/verify', jwt, verify)
router.get('/logout', logOut)
router.post(
  '/login',
  validateForm,
  required('username', 'Username', 1),
  required('password', 'Password', 1),
  validateBody,
  validateFinal,
  logIn
)
router.post(
  '/signup',
  validateAvatar,
  username,
  display,
  email,
  ...password,
  validateBody,
  validateFinal,
  postUser,
  uploadAvatar,
  signIn
)
router.post(
  '/email',
  jwt,
  validateForm,
  email,
  ...password,
  validateBody,
  validateFinal,
  connectEmail
)

router.get('/github', github)
router.get('/github/callback', jwtOptional, github, githubCallback)
router.post(
  '/github/signup',
  jwtTemp,
  validateForm,
  username,
  display,
  validateBody,
  validateFinal,
  uploadAuto,
  githubSignUp
)

router.get('/google', google)
router.get('/google/callback', jwtOptional, google, googleCallback)
router.post(
  '/google/signup',
  jwtTemp,
  validateForm,
  username,
  display,
  validateBody,
  validateFinal,
  uploadAuto,
  googleSignUp
)

export default router
