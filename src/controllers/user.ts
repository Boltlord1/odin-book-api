import { hash } from 'bcrypt'
import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import type {
  IdentityCreateInput,
  UserUpdateInput
} from '../../generated/prisma/models'
import shortId from '../lib/cuid2'
import prisma from '../lib/primsa'
import {
  refinePost,
  refineProfile,
  refineSelf,
  refineUser
} from '../lib/refine'
import { whitespace } from '../lib/variables'
import postGetter from '../prisma/post'
import userGetter from '../prisma/user'
import type { EmailData, RegisterData, UpdateBody } from '../types/body'
import type {
  EmailIdentity,
  PossibleUser,
  UserWithIdentities
} from '../types/prisma'
import type { UserIdRequest } from '../types/request'

const createUser: RequestHandler = async (req: UserIdRequest, _res, next) => {
  const { username, display, email, password } = matchedData<RegisterData>(req)
  const hashed = await hash(password, 10)
  const data: EmailIdentity = { hash: hashed, verified: false }

  const input: IdentityCreateInput = {
    provider: 'Email',
    id: email,
    data,
    user: {
      create: { id: shortId(), name: username, display: display || username }
    }
  }

  const user = await userGetter.create(input)
  req.userId = user.userId

  next()
}

const updateUser: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const { username, display } = matchedData<UpdateBody>(req)
  console.log(username)
  console.log(display)

  const updated = await userGetter.update(user.id, {
    name: username,
    display
  } as UserUpdateInput)

  const refined = refineSelf(updated)
  res.json(refined)
}

const getSelf: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const self = await userGetter.self(user.id)

  if (self === null) {
    res.clearCookie('access_token')
    res.status(401).send('Unauthorized')
    return
  }

  const refined = refineSelf(self)
  res.json(refined)
}

const getUser: RequestHandler = async (req, res) => {
  const user = req.user as PossibleUser
  const id = req.params.id as string

  const profile = await userGetter.profile(id, user?.id)

  if (profile === null) {
    res.status(404).send('Not found')
    return
  }

  const refined = refineProfile(profile)
  res.json(refined)
}

const getUsers: RequestHandler = async (_req, res) => {
  const users = await userGetter.many()
  res.json(users.map(refineUser))
}

const searchUsers: RequestHandler = async (req, res, next) => {
  const search = req.query.search

  if (typeof search !== 'string' || search === '') {
    next()
    return
  }

  const formatted = search.trim().split(whitespace).join(' & ')
  const users = await userGetter.search(formatted)

  const refined = users.map(refineUser)
  res.json(refined)
}

const getPosts: RequestHandler = async (req, res) => {
  const user = req.user as PossibleUser
  const authorId = req.params.id as string
  const sort = req.query.sort || 'recent'

  if (typeof sort !== 'string') {
    res.status(400).send('Invalid query')
    return
  }

  const posts = await postGetter.many(sort, user?.id, authorId)

  const refined = posts.map(refinePost)
  res.json(refined)
}

const connectEmail: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const exists = user.identities.find((i) => i.provider === 'Email')
  if (exists) {
    res.status(409).send('Account already has an email.')
    return
  }

  const { email, password } = matchedData<EmailData>(req)
  const hashed = await hash(password, 10)
  const data: EmailIdentity = { hash: hashed, verified: false }

  await prisma.identity.create({
    data: { provider: 'Email', id: email, data, userId: user.id }
  })

  res.clearCookie('access_token')
  res.status(200).send('Success')
}

const checkUsername: RequestHandler = async (req, res) => {
  const name = req.query.name
  console.log(name)
  if (typeof name !== 'string') {
    res.status(400).send('Invalid query')
    return
  }

  const user = await prisma.user.findUnique({
    where: { name },
    select: { name: true }
  })

  res.json(user === null)
}

export {
  checkUsername,
  connectEmail,
  createUser,
  getPosts,
  getSelf,
  getUser,
  getUsers,
  searchUsers,
  updateUser
}
