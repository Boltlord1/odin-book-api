import bcrypt from 'bcrypt'
import type { RequestHandler } from 'express'
import { matchedData, validationResult } from 'express-validator'
import createId from '../lib/cuid2'
import prisma from '../lib/primsa'
import type { EmailData } from '../types/data'
import type { UserIdRequest } from '../types/interfaces'
import type { UserWithIdentities } from '../types/prisma'

interface RegisterData {
	username: string
	display: string
	email: string
	password: string
}

const getUser: RequestHandler = async (req, res) => {
	const name = req.params.name as string

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
	const user = req.user as UserWithIdentities

	const self = await prisma.user.findUnique({
		where: {
			id: user.id
		},
		include: {
			identities: true
		}
	})
	res.json(self)
}

const createUser: RequestHandler = async (req: UserIdRequest, res, next) => {
	const { username, display, email, password } = matchedData<RegisterData>(req)
	const hash = await bcrypt.hash(password, 10)
	const data: EmailData = { hash, verified: false }
	const user = await prisma.identity.create({
		data: {
			provider: 'Email',
			id: email,
			data,
			user: {
				create: {
					id: createId(),
					name: username,
					display: display
				}
			}
		}
	})
	req.userId = user.userId

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

	const oldUser = req.user as UserWithIdentities
	const { username, display } = matchedData<UpdateBody>(req)

	const data: UpdateData = {}

	if (username && username !== oldUser.name) data.name = username
	if (display) data.display = display

	const user = await prisma.user.update({
		where: {
			id: oldUser.id
		},
		data,
		include: { identities: true }
	})

	res.json(user)
}

export { createUser, getSelf, getUser, updateUser }
