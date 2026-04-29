import { Buffer } from 'node:buffer'
import type { UploadApiResponse } from 'cloudinary'
import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import multer from 'multer'
import cloudinary from '../lib/cloudinary'
import createId from '../lib/cuid2'
import prisma from '../lib/primsa'
import type { ErrorRequest, PostRequest, ReqError } from '../types/interfaces'
import type { UserWithIdentities } from '../types/prisma'

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
	const user = req.user as UserWithIdentities

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
				orderBy: { createdAt: 'asc' },
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
			},
			likedBy: {
				where: {
					id: user.id
				}
			},
			images: true
		}
	})

	res.json(posts)
}

const getPost: RequestHandler = async (req, res) => {
	const user = req.user as UserWithIdentities
	const id = req.params.id as string

	const post = await prisma.post.findUnique({
		where: {
			id
		},
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
				orderBy: { createdAt: 'asc' },
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
			},
			likedBy: {
				where: {
					id: user.id
				}
			},
			images: true
		}
	})

	res.json(post)
}

const createPost: RequestHandler = async (req: PostRequest, res, next) => {
	const user = req.user as UserWithIdentities

	const { title, content } = matchedData<PostData>(req)

	const post = await prisma.post.create({
		data: {
			id: createId(),
			title,
			content: content || null,
			authorId: user.id
		}
	})

	req.postId = post.id
	next()
}

const uploadImages: RequestHandler = async (req: PostRequest, res) => {
	const postId = req.postId as string
	const files = req.files as Express.Multer.File[]
	if (!files) {
		res.json(postId)
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
			id: createId(),
			publicId: r.value.public_id,
			height: r.value.height,
			width: r.value.width,
			postId: postId
		}
	})

	await prisma.image.createMany({
		data: imageData
	})

	res.json(postId)
}

export { createPost, getPost, getPosts, parseImages, uploadImages }
