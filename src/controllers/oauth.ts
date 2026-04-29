import { createId } from '@paralleldrive/cuid2'
import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import type { Provider } from '../../generated/prisma/enums'
import { longOptions, tempOptions } from '../lib/cookie'
import { issueJwt, issueTempJwt } from '../lib/issueJwt'
import prisma from '../lib/primsa'
import { frontendUrl } from '../lib/variables'
import type { OauthData } from '../types/body'
import type { Case } from '../types/case'
import type { AvatarRequest } from '../types/request'
import type { TempPayload } from '../types/temp'

const oauthCallback = (provider: Provider) => {
	const verifyFunction: RequestHandler = async (req, res) => {
		const _case = req.user as Case
		if (_case.type === 'verified') {
			const token = issueJwt(_case.id)
			res.cookie('access_token', token, longOptions)
			res.redirect(`${frontendUrl}`)
		} else {
			const token = issueTempJwt(_case.id, _case.avatar, _case.data, provider)
			res.cookie('temp_token', token, tempOptions)
			res.redirect(`${frontendUrl}/auth/signup/${provider.toLowerCase()}`)
		}
	}

	return verifyFunction
}

const oauthSignUp = (provider: Provider) => {
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

const googleCallback = oauthCallback('Google')
const googleSignUp = oauthSignUp('Google')

const githubCallback = oauthCallback('Github')
const githubSignUp = oauthSignUp('Github')

export { githubCallback, githubSignUp, googleCallback, googleSignUp }
