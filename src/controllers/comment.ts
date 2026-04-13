import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import prisma from '../lib/primsa'

interface CommentData {
	content: string
}

const createComment: RequestHandler = async (req, res) => {
	if (!req.user) {
		res.json(false)
		return
	}

	const postId = req.params.id
	if (typeof postId !== 'string') {
		res.json({ msg: 'post not found' })
		return
	}

	const { content } = matchedData<CommentData>(req)
	const user = req.user

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
