import { body } from 'express-validator'

function required(name: string, msg: string, min: number = 4) {
	return body(name)
		.trim()
		.notEmpty()
		.withMessage(`Missing ${msg}!`)
		.isLength({ min, max: 32 })
		.withMessage(`${msg} must be between ${min} and 32 characters.`)
}

function optional(name: string, msg: string, min: number = 2) {
	return body(name)
		.trim()
		.optional({ values: 'falsy' })
		.isLength({ min, max: 32 })
		.withMessage(`${msg} must be between ${min} and 32 characters.`)
}

const password = body('password')
	.trim()
	.notEmpty()
	.withMessage('Missing password!')
	.isLength({ min: 6, max: 32 })
	.withMessage('Password must be between 6 and 32 characters.')
	.isStrongPassword({
		minLength: 6,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 0
	})
	.withMessage(
		'Password must contain a number, lowercase and uppercase letter.'
	)

const content = body('content')
	.trim()
	.isLength({ max: 512 })
	.withMessage('Content must be less than 512 characters.')

const title = body('title')
	.trim()
	.notEmpty()
	.withMessage('Missing title!')
	.isLength({ max: 256 })
	.withMessage('Title must be less than 256 characters.')

export { content, optional, password, required, title }
