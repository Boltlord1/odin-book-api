import type { RequestHandler } from 'express'
import { matchedData, validationResult } from 'express-validator'
import prisma from '../lib/primsa'

interface PostData {
	title: string
	content: string
}

interface requestUser {
	id: string
	iat: number
}

const getPosts: RequestHandler = async (req, res) => {
	const posts = await prisma.post.findMany({
		orderBy: { createdAt: 'desc' },
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
						select: { name: true, display: true, avatar: true}
					}
				}
			}
		}
	})

	res.json(post)
}

const createPost: RequestHandler = async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty() || req.user == null) {
		res.json(errors.array())
		return
	}

	const { content } = matchedData<PostData>(req)
	const user = req.user as requestUser
	const postId = req.body.id

	const post = await prisma.comment.create({
		data: {
			content,
			postId,
			authorId: user.id
		}
	})

	res.json(post)
}

export { createPost, getPost, getPosts }
