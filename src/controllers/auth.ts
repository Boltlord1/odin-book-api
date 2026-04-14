import bcrypt from 'bcrypt'
import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import type { Provider } from '../../generated/prisma/enums'
import type { AvatarRequest, UserIdRequest } from '../lib/interfaces'
import { issueJwt, issueTempJwt, type TempPayload } from '../lib/issueJwt'
import prisma from '../lib/primsa'

interface LoginData {
	username: string
	password: string
}

interface OauthData {
	username: string
	display: string
}

const signIn: RequestHandler = async (req: UserIdRequest, res) => {
	const id = req.userId
	if (!id) {
		res.json(false)
		return
	}
	const token = issueJwt(id)
	res.json(token.token)
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

		const token = issueTempJwt(identity.id, identity.avatar, provider)
		res.json(token)
	}

	return verifyFunction
}

const oauthRegister = (provider: Provider) => {
	const createUser: RequestHandler = async (req: AvatarRequest, res) => {
		const payload = req.payload
		const avatar = req.avatar || 'default'
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
						avatar
					}
				}
			}
		})

		const token = issueJwt(user.id)
		res.json(token)
	}

	return createUser
}

export { logIn, oauthCallback, oauthRegister, signIn }
