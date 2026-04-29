import type { RequestHandler } from 'express'
import prisma from '../lib/primsa'
import type { UserWithIdentities } from '../types/prisma'

const changeLike = (
	type: 'post' | 'comment',
	action: 'connect' | 'disconnect'
) => {
	const change: RequestHandler = async (req, res) => {
		const user = req.user as UserWithIdentities
		const postId = req.params.id as string

		const row = type === 'post' ? 'likedPosts' : 'likedComments'
		await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				[`${row}`]: {
					[`${action}`]: {
						id: postId
					}
				}
			}
		})

		res.json(true)
	}

	return change
}

export { changeLike }
