import { compare } from 'bcrypt'
import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import { longOptions } from '../lib/cookie'
import { serverError } from '../lib/errors'
import { issueJwt } from '../lib/issueJwt'
import prisma from '../lib/primsa'
import { frontendUrl } from '../lib/variables'
import type { LogInData } from '../types/body'
import type { EmailIdentity } from '../types/prisma'
import type { UserIdRequest } from '../types/request'

const signIn: RequestHandler = (req: UserIdRequest, res) => {
  const id = req.userId as string

  const token = issueJwt(id)
  res.cookie('access_token', token, longOptions)
  res.send(200).send('Authorized')
}

const logIn: RequestHandler = async (req, res) => {
  const { username, password } = matchedData<LogInData>(req)
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          name: username
        },
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
    const error = serverError('Invalid username or password.')
    return res.status(401).json(error)
  }

  const data = user.identities[0].data as EmailIdentity
  const match = await compare(password, data.hash)
  if (!match) {
    const error = serverError('Invalid username or password.')
    return res.status(401).json(error)
  }

  const token = issueJwt(user.id)
  res.cookie('access_token', token, longOptions)
  res.send(200).send('Authorized')
}

const logOut: RequestHandler = (_req, res) => {
  res.clearCookie('access_token')
  res.redirect(`${frontendUrl}/auth/login`)
}

const verify: RequestHandler = (_req, res) => {
  res.status(200).send('Authorized')
}

export { logIn, logOut, signIn, verify }
