import bcrypt from 'bcrypt'
import type { RequestHandler } from 'express'
import { matchedData, validationResult } from 'express-validator'
import type { User } from '../../generated/prisma/client'
import createId from '../lib/cuid2'
import type { UserIdRequest } from '../lib/interfaces'
import prisma from '../lib/primsa'

interface RegisterData {
	username: string
	password: string
	display: string
}

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

const getSelf: RequestHandler = async (req, res) => {
	const user = req.user
	if (!user) {
		res.json('unauthorized')
		return
	}

	const self = await prisma.user.findUnique({
		where: {
			id: user.id
		}
	})
	res.json(self)
}

const createUser: RequestHandler = async (req: UserIdRequest, res, next) => {
	const { username, password, display } = matchedData<RegisterData>(req)
	const hash = await bcrypt.hash(password, 10)
	try {
		const user = await prisma.localUser.create({
			data: {
				hash,
				user: {
					create: {
						id: createId(),
						name: username,
						display,
						avatar: 'default'
					}
				}
			}
		})
		req.userId = user.userId
	} catch (error) {
		res.json(false)
		return
	}

	next()
}

interface UpdateBody {
	username: string
	display: string
}

interface UpdateData {
	name?: string
	display?: string
}

const updateUser: RequestHandler = async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		res.status(200).json(errors.array())
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

export { createUser, getSelf, getUser, updateUser }
