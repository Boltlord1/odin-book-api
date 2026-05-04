import { Router } from 'express'
import { logIn, logOut, signIn, verify } from '../controllers/auth'
import { uploadAuto, uploadAvatar } from '../controllers/cloudinary'
import {
  githubCallback,
  githubSignUp,
  googleCallback,
  googleSignUp
} from '../controllers/oauth'
import { connectEmail, createUser } from '../controllers/user'
import {
  validateAvatar,
  validateBody,
  validateFinal
} from '../controllers/validate'
import { display, email, password, required, username } from '../lib/validator'
import { github, google, jwt, jwtOptional, jwtTemp } from '../passport/passport'

const getVerify = [
  jwt,
  verify
]
const postSignUp = [
  validateAvatar,
  username,
  display,
  email,
  ...password,
  validateBody,
  validateFinal,
  createUser,
  uploadAvatar,
  signIn
]

const postLogIn = [
  username,
  required('password', 'Password', 1),
  validateBody,
  validateFinal,
  logIn
]

const getLogOut = [
  logOut
]
const getGoogle = [
  google
]
const getGoogleCallback = [
  jwtOptional,
  google,
  googleCallback
]
const postGoogleSignUp = [
  jwtTemp,
  username,
  display,
  validateBody,
  validateFinal,
  uploadAuto,
  googleSignUp
]

const getGithub = [
  github
]
const getGithubCallback = [
  jwtOptional,
  github,
  githubCallback
]
const postGithubSignUp = [
  jwtTemp,
  username,
  display,
  validateBody,
  validateFinal,
  uploadAuto,
  githubSignUp
]

const postEmail = [
  jwt,
  email,
  ...password,
  validateBody,
  validateFinal,
  connectEmail
]

const router = Router()

router.get('/verify', getVerify)
router.post('/login', postLogIn)
router.get('/logout', getLogOut)
router.post('/signup', postSignUp)
router.post('/email', postEmail)

router.get('/github', getGithub)
router.get('/github/callback', getGithubCallback)
router.post('/github/signup', postGithubSignUp)

router.get('/google', getGoogle)
router.get('/google/callback', getGoogleCallback)
router.post('/google/signup', postGoogleSignUp)

export default router
