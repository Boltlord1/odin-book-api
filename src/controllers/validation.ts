import type { Request, RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import multer, { type Field } from 'multer'
import type { ReqError } from '../lib/interfaces'

interface ErrorRequest extends Request {
	sizeError?: ReqError | undefined
}

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 }
}).single('avatar')

const parseForm: RequestHandler = async (req: ErrorRequest, res, next) => {
	upload(req, res, (err) => {
		if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
			const error: ReqError = {
				type: 'client',
				name: 'avatar',
				msg: 'Avatar file size must be less than 5 MB.'
			}
			req.sizeError = error
		}

		next()
	})
}

const validateData: RequestHandler = async (req: ErrorRequest, res, next) => {
	const errors: ReqError[] = []

	const sizeError = req.sizeError
	if (sizeError) {
		errors.push(sizeError)
	}

	if (req.file) {
		const regexp = /image\/(jpeg|jpg|png)/
		if (!regexp.test(req.file.mimetype)) {
			const error: ReqError = {
				type: 'client',
				name: 'avatar',
				msg: 'Avatar file type must be png or jpeg.'
			}
			errors.push(error)
		}
	}

	const results = validationResult(req)
	if (!results.isEmpty()) {
		const array = results.array()
		for (const result of array) {
			if (result.type !== 'field') continue
			const error: ReqError = {
				type: 'client',
				name: result.path,
				msg: result.msg
			}
			errors.push(error)
		}
	}

	if (errors.length > 0) {
		res.json(errors)
		return
	}

	next()
}

export { parseForm, validateData }
