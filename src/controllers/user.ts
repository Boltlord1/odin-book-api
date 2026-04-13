import type { RequestHandler } from 'express'
import prisma from '../lib/primsa'

const getUser: RequestHandler = async (req, res) => {
	const name = req.params.name
	if (typeof name !== 'string') {
		return
	}

	const user = await prisma.user.findUnique({
		where: {
			name
		},
		select: {
			_count: {
				select: {
					follows: true,
					followers: true
				}
			},
			name: true,
			display: true,
			avatar: true,
			posts: {
				include: {
					comments: {
						include: {
							author: {
								select: {
									name: true,
									display: true,
									avatar: true
								}
							}
						}
					}
				}
			}
		}
	})

	res.json(user)
}

export { getUser }
