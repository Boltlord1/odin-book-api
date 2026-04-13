import type { RequestHandler } from 'express'
import prisma from '../lib/primsa'

const changeLike = (
	type: 'post' | 'comment',
	action: 'connect' | 'disconnect'
) => {
	const change: RequestHandler = async (req, res) => {
		const user = req.user
		if (!user) {
			res.send('unauthorized')
			return
		}

		const postId = req.params.id
		if (typeof postId !== 'string') {
			res.json(false)
			return
		}

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
