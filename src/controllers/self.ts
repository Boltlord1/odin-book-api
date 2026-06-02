import { hash } from 'bcrypt'
import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import {
  createEmail,
  createUser,
  findSelf,
  type UserWithIdentities,
  updateSelf
} from '../database/user'
import { ServerError } from '../lib/error'
import prisma from '../lib/primsa'
import parseQuery from '../routers/query'
import type { EmailData, RegisterData, UpdateBody } from '../types/body'
import type { EmailIdentity } from '../types/identity'
import type { UserIdRequest } from '../types/request'

export const postUser: RequestHandler = async (
  req: UserIdRequest,
  _res,
  next
) => {
  const { username, display, email, password } = matchedData<RegisterData>(req)
  const hashed = await hash(password, 10)

  const data: EmailIdentity = { verified: false }

  const user = await createUser(username, display, email, data, hashed)
  req.userId = user.id

  next()
}

export const updateNames: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const { username, display } = matchedData<UpdateBody>(req)

  const updated = await updateSelf(user.id, { name: username, display })
  res.json(updated)
}

export const getSelf: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const self = await findSelf(user.id)

  res.json(self)
}

export const connectEmail: RequestHandler = async (req, res) => {
  const self = req.user as UserWithIdentities
  const exists = self.identities.find((i) => i.provider === 'Email')
  if (exists) {
    const error = new ServerError('This account already has an email')
    res.status(409).json(error)
    return
  }

  const { email, password } = matchedData<EmailData>(req)
  const hashed = await hash(password, 10)
  const data: EmailIdentity = { verified: false }

  await createEmail(self.id, email, data, hashed)
  res.status(200).end()
}

export const checkUsername: RequestHandler = async (req, res) => {
  const name = parseQuery(req.query.name)

  if (!name) {
    res.json(true)
    return
  }

  const user = await prisma.user.findUnique({
    where: { name },
    select: { name: true }
  })

  res.json(user === null)
}
