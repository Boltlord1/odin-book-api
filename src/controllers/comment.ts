import type { RequestHandler } from 'express'
import { matchedData, validationResult } from 'express-validator'
import prisma from '../lib/primsa'

interface CommentData {
	content: string
}

interface requestUser {
	id: string
	iat: number
}

const createComment: RequestHandler = async (req, res) => {
	const errors = validationResult(req)
	const postId = req.params.id
	if (!errors.isEmpty() || req.user == null || typeof postId !== 'string') {
		res.json(errors.array().map((obj) => obj.msg))
		return
	}

	const { content } = matchedData<CommentData>(req)
	const user = req.user as requestUser

	const comment = await prisma.comment.create({
		data: {
			content,
			postId,
			authorId: user.id
		}
	})

	res.json(comment)
}

export { createComment }
