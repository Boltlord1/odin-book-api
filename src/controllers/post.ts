import type { NextFunction, Request, RequestHandler, Response } from 'express'
import { matchedData, validationResult } from 'express-validator'
import prisma from '../lib/primsa'

interface PostData {
  title: string,
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
				select: { id: false, name: true, display: true, avatar: true }
			},
			comments: {
				include: {
					author: {
						select: { id: false, name: true, display: true, avatar: true }
					}
				}
			}
		}
	})

	res.json(posts)
}

const createPost: RequestHandler = async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty() || req.user == null) {
		res.json(errors.array())
		return
	}

	const { content, title } = matchedData<PostData>(req)
	const user = req.user as requestUser

	const post = await prisma.post.create({
		data: {
			content,
			title,
			authorId: user.id
		}
	})

	res.json(post)
}

export { createPost, getPosts }
