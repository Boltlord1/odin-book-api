import type { RequestHandler } from 'express'
import prisma from '../lib/primsa'
import type { UserWithIdentities } from '../types/prisma'

const follow: RequestHandler = async (req, res) => {
	const user = req.user as UserWithIdentities
	const id = req.params.id as string

	await prisma.user.update({
		where: {
			id
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
	const user = req.user as UserWithIdentities
	const id = req.params.id as string

	await prisma.user.update({
		where: {
			id
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
