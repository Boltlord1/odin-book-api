import { createId } from '@paralleldrive/cuid2'
import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import prisma from '../lib/primsa'
import { refineComment, refinePost } from '../lib/refine'
import { frontendUrl } from '../lib/variables'
import type { CommentData, PostData } from '../types/body'
import type { PossibleUser, UserWithIdentities } from '../types/prisma'
import type { PostRequest } from '../types/request'

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

	const postId = post.id
	const files = req.files
	if (!req.files || !Array.isArray(files)) {
		res.redirect(`${frontendUrl}/app/post/${postId}`)
		return
	}

	req.postId = postId
	next()
}

const getPosts: RequestHandler = async (req, res) => {
	const user = req.user as UserWithIdentities
	const where = user ? { id: user.id } : {}

	const posts = await prisma.post.findMany({
		orderBy: { createdAt: 'desc' },
		include: {
			images: true,
			author: true,
			_count: {
				select: {
					likedBy: {
						where: { NOT: where }
					},
					comments: true
				}
			},
			likedBy: {
				where
			}
		}
	})

	const refined = posts.map(refinePost)
	res.json(refined)
}

const getPost: RequestHandler = async (req, res) => {
	const user = req.user as PossibleUser
	const where = user ? { id: user.id } : {}

	const id = req.params.id as string
	const post = await prisma.post.findUnique({
		where: { id },
		include: {
			images: true,
			author: true,
			_count: {
				select: {
					likedBy: {
						where: {
							NOT: where
						}
					},
					comments: true
				}
			},
			likedBy: {
				where
			}
		}
	})

	if (post === null) {
		res.status(404).send('Not found')
		return
	}

	const refined = refinePost(post)
	res.json(refined)
}

const createComment: RequestHandler = async (req, res) => {
	const user = req.user as UserWithIdentities
	const postId = req.params.id as string

	const { comment } = matchedData<CommentData>(req)
	await prisma.comment.create({
		data: {
			id: createId(),
			content: comment,
			postId,
			authorId: user.id
		}
	})

	res.status(201).send('Success')
}

const getComments: RequestHandler = async (req, res) => {
	const user = req.user as PossibleUser
	const likedBy = user ? { where: { id: user.id } } : {}

	const postId = req.params.id as string
	const comments = await prisma.comment.findMany({
		where: { postId },
		include: {
			author: true,
			_count: {
				select: {
					likedBy: true
				}
			},
			likedBy
		}
	})

	const refined = comments.map(refineComment)
	res.json(refined)
}

const changeLike = (
	type: 'post' | 'comment',
	action: 'connect' | 'disconnect'
) => {
	const change: RequestHandler = async (req, res) => {
		const user = req.user as UserWithIdentities
		const postId = req.params.id as string
		const commentId = req.params.comment as string

		const row = type === 'post' ? 'likedPosts' : 'likedComments'
		const id = type === 'post' ? postId : commentId
		await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				[`${row}`]: {
					[`${action}`]: {
						id
					}
				}
			}
		})

		res.status(202).send('Success')
	}

	return change
}

const likePost = changeLike('post', 'connect')
const unlikePost = changeLike('post', 'disconnect')
const likeComment = changeLike('comment', 'connect')
const unlikeComment = changeLike('comment', 'disconnect')

export {
	createComment,
	createPost,
	getComments,
	getPost,
	getPosts,
	likeComment,
	likePost,
	unlikeComment,
	unlikePost
}
