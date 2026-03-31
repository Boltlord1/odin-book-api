import bcrypt from 'bcrypt'
import type { RequestHandler } from 'express'
import { matchedData, validationResult } from 'express-validator'
import issueJwt from '../lib/issueJwt'
import prisma from '../lib/primsa'

interface RegisterData {
	username: string
	password: string
	display: string
}

interface LoginData {
	username: string
	password: string
}

const createUser: RequestHandler = async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		res.json(errors.array())
		return
	}

	const { username, password, display } = matchedData<RegisterData>(req)
	const hash = await bcrypt.hash(password, 10)
	const user = await prisma.user.create({
		data: {
			name: username,
			avatar: 'default',
			display,
			hash
		}
	})

	try {
		const token = issueJwt(user.id)
		res.json(token.token)
	} catch (error) {
		await prisma.user.delete({ where: { id: user.id } })
		console.log(error)
		res.json(false)
	}
}

const logIn: RequestHandler = async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		res.json(errors.array())
		return
	}

	const { username, password } = matchedData<LoginData>(req)

	const user = await prisma.user.findFirst({
		where: { name: username }
	})

	if (user === null) {
		return res.json(false)
	}

	const match = await bcrypt.compare(password, user.hash)
	if (!match) {
		return res.json(false)
	}

	const token = issueJwt(user.id)
	res.json(token.token)
}

export { createUser, logIn }
