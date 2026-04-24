import bcrypt from 'bcrypt'
import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import type { Provider } from '../../generated/prisma/enums'
import createId from '../lib/cuid2'
import type { AvatarRequest, ReqError, UserIdRequest } from '../lib/interfaces'
import { issueJwt, issueTempJwt } from '../lib/issueJwt'
import prisma from '../lib/primsa'

interface LoginData {
	username: string
	password: string
}

interface OauthData {
	username: string
	display: string
}

const verify: RequestHandler = async (req, res) => {
	res.status(200).send('okay')
}

const signIn: RequestHandler = async (req: UserIdRequest, res) => {
	const id = req.userId
	if (!id) {
		res.json(false)
		return
	}
	const token = issueJwt(id)

	res.json(token)
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
		const error: ReqError = {
			type: 'client',
			name: 'username',
			msg: 'User not found.'
		}
		return res.json(error)
	}

	const match = await bcrypt.compare(password, user.local.hash)
	if (!match) {
		const error: ReqError = {
			type: 'client',
			name: 'password',
			msg: 'Wrong password.'
		}
		return res.json(error)
	}

	const token = issueJwt(user.id)
	res.cookie('access_token', token, {
		httpOnly: true,
		secure: true,
		sameSite: 'none',
		maxAge: 1000 * 60 * 60 * 24 * 7
	})

	res.json(true)
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
						id: createId(),
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

export { logIn, oauthCallback, oauthRegister, signIn, verify }
