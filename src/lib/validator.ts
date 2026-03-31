import { body } from 'express-validator'

const username = body('username')
	.trim()
	.notEmpty()
	.withMessage('Missing username!')
	.isLength({ min: 4, max: 32 })
	.withMessage('Username must be between 4 and 32 characters.')

const password = body('password')
	.trim()
	.isLength({ min: 6, max: 32 })
	.isStrongPassword({
		minLength: 6,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 0
	})
	.withMessage(
		'Password must be between 6 and 32 characters and contain at least one lower and uppercase letter and a number.'
	)

const display = body('display')
	.trim()
	.isLength({ max: 32 })
	.withMessage('Display name must be less than 32 characters.')

const content = body('content')
	.trim()
	.notEmpty()
	.withMessage('Missing content!')
	.isLength({ max: 512 })
	.withMessage('Content must be less than 512 characters.')

const title = body('title')
	.trim()
	.notEmpty()
	.withMessage('Missing title!')
	.isLength({ max: 256 })
	.withMessage('Title must be less than 256 characters.')

export { content, display, password, username, title }
