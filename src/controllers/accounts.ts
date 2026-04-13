import type { RequestHandler } from 'express'
import { matchedData, validationResult } from 'express-validator'
import type { User } from '../../generated/prisma/client'
import prisma from '../lib/primsa'

interface UpdateBody {
	username: string
	display: string
}

interface UpdateData {
	name?: string
	display?: string
}

const getSelf: RequestHandler = async (req, res) => {
	const user = req.user
	if (!user) {
		res.json('unauthorized')
		return
	}

	const self = await prisma.user.findUnique({
		where: {
			id: user.id
		},
		include: {
			_count: {
				select: {
					follows: true,
					followers: true
				}
			}
		}
	})
	res.json(self)
}

const updateUser: RequestHandler = async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		res.json(errors.array())
		return
	}

	const oldUser = req.user as User
	const { username, display } = matchedData<UpdateBody>(req)

	const data: UpdateData = {}

	if (username && username !== oldUser.name) data.name = username
	if (display) data.display = display

	const user = await prisma.user.update({
		where: {
			id: oldUser.id
		},
		data
	})

	res.json(user)
}

export { getSelf, updateUser }
