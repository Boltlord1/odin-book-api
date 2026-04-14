import { Buffer } from 'node:buffer'
import type { Request, RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import multer from 'multer'
import cloudinary from '../lib/cloudinary'
import type {
	AvatarRequest,
	ErrorRequest,
	ReqError,
	UserIdRequest
} from '../lib/interfaces'
import prisma from '../lib/primsa'

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 }
}).single('avatar')

const parseAvatar: RequestHandler = async (req: ErrorRequest, res, next) => {
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

	const files = req.files
	if (files && Array.isArray(files)) {
		const regexp = /image\/(jpeg|jpg|png|gif)/
		for (const file of files) {
			if (!regexp.test(file.mimetype)) {
				const error: ReqError = {
					type: 'client',
					name: 'avatar',
					msg: 'Image file type must be png, jpeg or gif.'
				}
				errors.push(error)
			}
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

const uploadAvatar: RequestHandler = async (req: UserIdRequest, res, next) => {
	const id = req.userId
	if (!id) {
		res.json(false)
		return
	}

	const file = req.file
	if (!file) {
		next()
		return
	}

	const folder = `${process.env.AVATAR_FOLDER}`
	const b64 = Buffer.from(file.buffer).toString('base64')
	const dataURI = `data:${file.mimetype};base64,${b64}`

	try {
		const response = await cloudinary.uploader.upload(dataURI, {
			folder,
			resource_type: 'auto'
		})
		await prisma.user.update({
			where: { id },
			data: { avatar: response.public_id }
		})
	} catch (err) {
		const error: ReqError = {
			type: 'server',
			name: 'cloudinary',
			msg: 'Error uploading avatar.'
		}
		res.json(error)
	}

	next()
}

const uploadAuto: RequestHandler = async (req: AvatarRequest, res, next) => {
	const user = req.payload
	const avatar = user.avatar

	const folder = `${process.env.AVATAR_FOLDER}`
	const response = await cloudinary.uploader.upload(avatar, {
		folder,
		resource_type: 'auto'
	})
	req.avatar = response.public_id

	next()
}

const updateAvatar: RequestHandler = async (req, res) => {
	const user = req.user
	if (!user) {
		res.json(false)
		return
	}

	const file = req.file
	if (!file) {
		res.json(false)
		return
	}

	const folder = `${process.env.AVATAR_FOLDER}`
	const b64 = Buffer.from(file.buffer).toString('base64')
	const dataURI = `data:${file.mimetype};base64,${b64}`

	try {
		const response = await cloudinary.uploader.upload(dataURI, {
			folder,
			resource_type: 'auto'
		})
		await prisma.user.update({
			where: { id: user.id },
			data: { avatar: response.public_id }
		})
		await cloudinary.uploader.destroy(user.avatar)
		res.json(true)
	} catch (err) {
		const error: ReqError = {
			type: 'server',
			name: 'cloudinary',
			msg: 'Error uploading avatar.'
		}
		res.json(error)
	}
}

export { parseAvatar, updateAvatar, uploadAuto, uploadAvatar, validateData }
