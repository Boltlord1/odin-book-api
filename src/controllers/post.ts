import { Buffer } from 'node:buffer'
import type { UploadApiResponse } from 'cloudinary'
import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import multer from 'multer'
import cloudinary from '../lib/cloudinary'
import type { ErrorRequest, PostRequest, ReqError } from '../lib/interfaces'
import prisma from '../lib/primsa'

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 }
}).array('images', 5)

interface PostData {
	title: string
	content: string
}

const parseImages: RequestHandler = async (req: ErrorRequest, res, next) => {
	upload(req, res, (err) => {
		if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
			const error: ReqError = {
				type: 'client',
				name: 'images',
				msg: 'Image file size must be less than 5 MB.'
			}
			req.sizeError = error
		}

		next()
	})
}

const getPosts: RequestHandler = async (req, res) => {
	const posts = await prisma.post.findMany({
		orderBy: { createdAt: 'desc' },
		include: {
			_count: {
				select: {
					likedBy: true
				}
			},
			author: {
				select: { name: true, display: true, avatar: true }
			},
			comments: {
				include: {
					_count: {
						select: {
							likedBy: true
						}
					},
					author: {
						select: { name: true, display: true, avatar: true }
					}
				}
			}
		}
	})

	res.json(posts)
}

const getPost: RequestHandler = async (req, res) => {
	const id = req.params.id
	if (typeof id !== 'string') {
		res.json(false)
		return
	}

	const post = await prisma.post.findUnique({
		where: {
			id
		},
		include: {
			author: {
				select: { name: true, display: true, avatar: true }
			},
			comments: {
				include: {
					author: {
						select: { name: true, display: true, avatar: true }
					}
				}
			}
		}
	})

	res.json(post)
}

const createPost: RequestHandler = async (req: PostRequest, res, next) => {
	const user = req.user
	if (!user) {
		res.json(false)
		return
	}

	const { title, content } = matchedData<PostData>(req)

	const post = await prisma.post.create({
		data: {
			title,
			content,
			authorId: user.id
		}
	})

	req.postId = post.id
	next()
}

const uploadImages: RequestHandler = async (req: PostRequest, res) => {
	const postId = req.postId
	if (!postId) {
		res.json(false)
		return
	}

	const files = req.files
	if (!files || !Array.isArray(files)) {
		res.json(true)
		return
	}

	const promises: Promise<UploadApiResponse>[] = []
	for (const file of files) {
		const folder = `${process.env.POST_FOLDER}`
		const b64 = Buffer.from(file.buffer).toString('base64')
		const dataURI = `data:${file.mimetype};base64,${b64}`
		const promise = cloudinary.uploader.upload(dataURI, {
			folder,
			resource_type: 'auto'
		})
		promises.push(promise)
	}

	const responses = await Promise.allSettled(promises)

	const fulfilled = responses.filter((r) => r.status === 'fulfilled')
	const rejected = responses.filter((r) => r.status === 'rejected')

	if (rejected.length > 0) {
		const destroy = fulfilled.map((r) =>
			cloudinary.uploader.destroy(r.value.public_id)
		)
		await Promise.all(destroy)

		const error: ReqError = {
			type: 'server',
			msg: 'Error uploading images.',
			name: 'cloudinary'
		}
		res.json(error)
		return
	}

	const imageData = fulfilled.map((r) => {
		return {
			publicId: r.value.public_id,
			postId: postId
		}
	})

	await prisma.image.createMany({
		data: imageData
	})

	res.json(true)
}

export { createPost, getPost, getPosts, parseImages, uploadImages }
