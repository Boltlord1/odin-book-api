import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import createId from '../lib/cuid2'
import prisma from '../lib/primsa'

interface CommentData {
	content: string
}

const createComment: RequestHandler = async (req, res) => {
	const user = req.user
	if (!user) {
		res.json(false)
		return
	}

	const postId = req.params.id
	if (typeof postId !== 'string') {
		res.json({ msg: 'post not found' })
		return
	}

	const { content } = matchedData<CommentData>(req)

	const comment = await prisma.comment.create({
		data: {
			id: createId(),
			content,
			postId,
			authorId: user.id
		}
	})

	res.json(true)
}

export { createComment }
