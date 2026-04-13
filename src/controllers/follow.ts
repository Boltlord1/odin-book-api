import type { RequestHandler } from 'express'
import prisma from '../lib/primsa'

const follow: RequestHandler = async (req, res) => {
	const user = req.user
	if (!user) {
		res.send('unauthorized')
		return
	}

	const target = req.params.id
	if (typeof target !== 'string') {
		res.json(false)
		return
	}

	await prisma.user.update({
		where: {
			id: target
		},
		data: {
			followers: {
				connect: {
					id: user.id
				}
			}
		}
	})

	res.json(true)
}

const unfollow: RequestHandler = async (req, res) => {
	const user = req.user
	if (!user) {
		res.send('unauthorized')
		return
	}

	const target = req.params.id
	if (typeof target !== 'string') {
		res.json(false)
		return
	}

	await prisma.user.update({
		where: {
			id: target
		},
		data: {
			followers: {
				disconnect: {
					id: user.id
				}
			}
		}
	})

	res.json(true)
}

export { follow, unfollow }
