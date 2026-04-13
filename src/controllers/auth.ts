import bcrypt from 'bcrypt'
import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import type { Provider } from '../../generated/prisma/enums'
import { issueJwt, issueTempJwt, type TempPayload } from '../lib/issueJwt'
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

interface OauthData {
	username: string
	display: string
}

const createUser: RequestHandler = async (req, res) => {
	const { username, password, display } = matchedData<RegisterData>(req)
	const hash = await bcrypt.hash(password, 10)
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

	try {
		const token = issueJwt(user.userId)
		res.json(token.token)
	} catch (error) {
		await prisma.user.delete({ where: { id: user.userId } })
		console.log(error)
		res.json(false)
	}
}

const logIn: RequestHandler = async (req, res) => {
	const { username, password } = matchedData<LoginData>(req)
	const user = await prisma.user.findUnique({
		where: { name: username },
		include: {
			local: true
		}
	})

	if (user === null || user.local === null) {
		return res.json(false)
	}

	const match = await bcrypt.compare(password, user.local.hash)
	if (!match) {
		return res.json(false)
	}

	const token = issueJwt(user.id)
	res.json(token.token)
}

const oauthCallback = (provider: Provider) => {
	const verifyFunction: RequestHandler = async (req, res) => {
		const identity = req.identity
		if (identity.exists) {
			const token = issueJwt(identity.id)
			res.json(token)
			return
		}

		const token = issueTempJwt(identity.id, provider)
		res.json(token)
	}

	return verifyFunction
}

const oauthRegister = (provider: Provider) => {
	const createUser: RequestHandler = async (req, res) => {
		const payload = req.payload
		if (payload.provider !== provider) {
			res.json(null)
			return
		}

		const { username, display } = matchedData<OauthData>(req)
		const user = await prisma.oauthUser.create({
			data: {
				provider: provider,
				id: payload.sub,
				user: {
					create: {
						name: username,
						display,
						avatar: 'default'
					}
				}
			}
		})

		const token = issueJwt(user.id)
		res.json(token)
	}

	return createUser
}

export { createUser, logIn, oauthCallback, oauthRegister }
