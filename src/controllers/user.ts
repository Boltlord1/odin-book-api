import bcrypt from 'bcrypt'
import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
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

const createUser: RequestHandler = async (req: UserIdRequest, res, next) => {
	const { username, password, display } = matchedData<RegisterData>(req)
	const hash = await bcrypt.hash(password, 10)
	try {
		const user = await prisma.localUser.create({
			data: {
				hash,
				user: {
					create: {
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

export { createUser, getUser }
