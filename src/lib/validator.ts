import { body } from 'express-validator'
import prisma from './primsa'

function required(name: string, msg: string, min = 4) {
  return body(name)
    .trim()
    .notEmpty()
    .withMessage(`${msg} is required`)
    .isLength({ min, max: 32 })
    .withMessage(`${msg} must be between ${min} and 32 characters`)
}

function optional(name: string, msg: string, min = 2) {
  return body(name)
    .trim()
    .optional({ values: 'falsy' })
    .isLength({ min, max: 32 })
    .withMessage(`${msg} must be between ${min} and 32 characters`)
    .customSanitizer((value) => (value === '' ? undefined : value))
}

const username = required('username', 'Username')
const display = optional('display', 'Display name')

const email = body('email')
  .trim()
  .notEmpty()
  .withMessage('Email is required.')
  .isEmail()
  .withMessage('Invalid email text.')
  .custom(async (value) => {
    const user = await prisma.identity.findUnique({
      where: { providerId: { provider: 'Email', id: value } }
    })

    if (user !== null) {
      throw new Error('A user already exists with this email address')
    }
  })

const password = [
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 6, max: 32 })
    .withMessage('Password must be between 6 and 32 characters')
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0
    })
    .withMessage(
      'Password must contain a number, lowercase and uppercase letter'
    ),
  body('confirm')
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match')
]

const title = body('title')
  .trim()
  .notEmpty()
  .withMessage('Post title is requied')
  .isLength({ max: 256 })
  .withMessage('Title must be less than 256 characters')

const post = body('content')
  .trim()
  .isLength({ max: 2000 })
  .withMessage('Post content must be less than 2000 characters')

function content(label: string) {
  return body('content')
    .trim()
    .notEmpty()
    .withMessage(`${label} is requied`)
    .isLength({ max: 500 })
    .withMessage(`${label} must be less than 500 characters`)
}

export {
  content,
  display,
  email,
  optional,
  password,
  post,
  required,
  title,
  username
}
