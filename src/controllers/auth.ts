import { compare } from 'bcrypt'
import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import { longOptions } from '../lib/cookie'
import { ServerError } from '../lib/error'
import { issueJwt } from '../lib/issueJwt'
import prisma from '../lib/primsa'
import { FRONTEND_URL } from '../lib/variables'
import type { LogInData } from '../types/body'
import type { UserIdRequest } from '../types/request'

const signIn: RequestHandler = (req: UserIdRequest, res) => {
  const id = req.userId as string

  const token = issueJwt(id)
  res.cookie('access_token', token, longOptions)
  res.status(200).send('Authorized')
}

const logIn: RequestHandler = async (req, res) => {
  const { username, password } = matchedData<LogInData>(req)
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { name: username },
        { identities: { some: { AND: { provider: 'Email', id: username } } } }
      ]
    },
    select: { id: true, password: true }
  })

  const errorMsg = 'Invalid username or password.'
  if (user === null || !user.password) {
    const error = new ServerError(errorMsg)
    return res.status(401).json(error)
  }

  const hash = user.password.hash
  const match = await compare(password, hash)
  if (!match) {
    const error = new ServerError(errorMsg)
    return res.status(401).json(error)
  }

  const token = issueJwt(user.id)
  res.cookie('access_token', token, longOptions)
  res.send(200).send('Authorized')
}

const logOut: RequestHandler = (_req, res) => {
  res.clearCookie('access_token')
  res.redirect(`${FRONTEND_URL}/auth/login`)
}

const verify: RequestHandler = (_req, res) => {
  res.status(200).send('Authorized')
}

export { logIn, logOut, signIn, verify }
