import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import prisma from '../lib/primsa'

interface PostData {
	title: string
	content: string
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

const createPost: RequestHandler = async (req, res) => {
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

	res.json(post)
}

export { createPost, getPost, getPosts }
