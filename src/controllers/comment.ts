import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import createId from '../lib/cuid2'
import prisma from '../lib/primsa'
import type { UserWithIdentities } from '../types/prisma'

interface CommentData {
	content: string
}

const createComment: RequestHandler = async (req, res) => {
	const user = req.user as UserWithIdentities
	const postId = req.params.id as string

	const { content } = matchedData<CommentData>(req)
	await prisma.comment.create({
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
