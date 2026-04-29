import bcrypt from 'bcrypt'
import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import type { User } from '../../generated/prisma/client'
import type { Provider } from '../../generated/prisma/enums'
import { longOptions, tempOptions } from '../lib/cookie'
import createId from '../lib/cuid2'
import { issueJwt, issueTempJwt } from '../lib/issueJwt'
import prisma from '../lib/primsa'
import passport from '../passport/passport'
import type { Case } from '../types/case'
import type { EmailData } from '../types/data'
import type {
	AvatarRequest,
	ReqError,
	UserIdRequest
} from '../types/interfaces'
import type { UserWithIdentities } from '../types/prisma'
import type { TempPayload } from '../types/temp'

const frontUrl = process.env.FRONT_END

interface LoginData {
	username: string
	password: string
}

interface OauthData {
	username: string
	display: string
}

interface AddEmailData {
	email: string
	password: string
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
	res.cookie('access_token', token, longOptions)
	res.json(true)
}

const logIn: RequestHandler = async (req, res) => {
	const { username, password } = matchedData<LoginData>(req)
	const user = await prisma.user.findFirst({
		where: {
			OR: [
				{ name: username },
				{
					identities: {
						some: {
							AND: {
								provider: 'Email',
								id: username
							}
						}
					}
				}
			]
		},
		include: {
			identities: {
				where: {
					provider: 'Email'
				}
			}
		}
	})

	if (user === null || !user.identities[0]) {
		const error: ReqError = {
			type: 'client',
			name: 'username',
			msg: 'User not found.'
		}
		return res.json(error)
	}

	const data = user.identities[0].data as EmailData
	const match = await bcrypt.compare(password, data.hash)
	if (!match) {
		const error: ReqError = {
			type: 'client',
			name: 'password',
			msg: 'Wrong password.'
		}
		return res.json(error)
	}

	const token = issueJwt(user.id)
	res.cookie('access_token', token, longOptions)

	res.json(true)
}

const logOut: RequestHandler = async (req, res) => {
	res.clearCookie('access_token')
	res.redirect(`${frontUrl}/auth/login`)
}

const oauthCallback = (provider: Provider) => {
	const verifyFunction: RequestHandler = async (req, res) => {
		const _case = req.user as Case
		if (_case.type === 'verified') {
			const token = issueJwt(_case.id)
			res.cookie('access_token', token, longOptions)
			res.redirect(`${frontUrl}`)
		} else {
			const token = issueTempJwt(_case.id, _case.avatar, _case.data, provider)
			res.cookie('temp_token', token, tempOptions)
			res.redirect(`${frontUrl}/auth/signup/${provider}`)
		}
	}

	return verifyFunction
}

const oauthRegister = (provider: Provider) => {
	const createUser: RequestHandler = async (req: AvatarRequest, res) => {
		const payload = req.user as TempPayload
		const avatar = req.avatar
		if (payload.provider !== provider) {
			res.json(null)
			return
		}

		const { username, display } = matchedData<OauthData>(req)
		const user = await prisma.identity.create({
			data: {
				provider: provider,
				id: payload.id,
				data: payload.data,
				user: {
					create: {
						id: createId(),
						name: username,
						display,
						...(avatar ? { avatar } : {})
					}
				}
			}
		})

		res.clearCookie('temp_token')
		const token = issueJwt(user.userId)
		res.cookie('access_token', token, longOptions)
		res.json(true)
	}

	return createUser
}

const optionalJwt: RequestHandler = (req, res, next) => {
	passport.authenticate(
		'jwt',
		{ session: false },
		(_err: unknown, user: User) => {
			if (user) {
				req.user = user
			}
			next()
		}
	)(req, res, next)
}

const addEmail: RequestHandler = async (req, res) => {
	const user = req.user as UserWithIdentities
	const exists = user.identities.find((i) => i.provider === 'Email')
	if (exists) {
		res.send('Account already has an email')
		return
	}

	const { email, password } = matchedData<AddEmailData>(req)
	const hash = await bcrypt.hash(password, 10)
	const data: EmailData = {
		hash,
		verified: false
	}

	await prisma.identity.create({
		data: {
			provider: 'Email',
			id: email,
			data,
			userId: user.id
		}
	})

	res.clearCookie('access_token')
	res.json(true)
}

export {
	addEmail,
	logIn,
	logOut,
	oauthCallback,
	oauthRegister,
	optionalJwt,
	signIn,
	verify
}
