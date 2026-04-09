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

const createComment: RequestHandler = async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty() || req.user == null) {
		res.json(errors.array())
		return
	}

	const { content } = matchedData<PostData>(req)
	const user = req.user as requestUser
  const postId = req.body.id

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
