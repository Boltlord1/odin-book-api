import { hash } from 'bcrypt'
import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import shortId from '../lib/cuid2'
import prisma from '../lib/primsa'
import { refinePost, refineSelf, refineUser } from '../lib/refine'
import postGetter from '../prisma/post'
import type {
  EmailData,
  RegisterData,
  UpdateBody,
  UpdateData
} from '../types/body'
import type {
  EmailIdentity,
  PossibleUser,
  UserWithIdentities
} from '../types/prisma'
import type { UserIdRequest } from '../types/request'

const createUser: RequestHandler = async (req: UserIdRequest, _res, next) => {
  const { username, display, email, password } = matchedData<RegisterData>(req)
  const hashed = await hash(password, 10)
  const data: EmailIdentity = {
    hash: hashed,
    verified: false
  }
  const user = await prisma.identity.create({
    data: {
      provider: 'Email',
      id: email,
      data,
      user: {
        create: {
          id: shortId(),
          name: username,
          display: display || username
        }
      }
    }
  })
  req.userId = user.userId

  next()
}

const updateUser: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const { username, display } = matchedData<UpdateBody>(req)

  const data: UpdateData = {}

  if (username && username !== user.name) {
    data.name = username
  }
  if (display) {
    data.display = display
  }

  const updated = await prisma.user.update({
    where: {
      id: user.id
    },
    data,
    include: {
      identities: true,
      _count: {
        select: {
          posts: true,
          follows: true,
          followers: true
        }
      }
    }
  })

  const refined = refineSelf(updated)
  res.json(refined)
}

const connectEmail: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const exists = user.identities.find(i => i.provider === 'Email')
  if (exists) {
    res.send('Account already has an email.')
    return
  }

  const { email, password } = matchedData<EmailData>(req)
  const hashed = await hash(password, 10)
  const data: EmailIdentity = {
    hash: hashed,
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
  res.status(200).send('Success')
}

const getSelf: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities

  const self = await prisma.user.findUnique({
    where: {
      id: user.id
    },
    include: {
      identities: true,
      _count: {
        select: {
          posts: true,
          follows: true,
          followers: true
        }
      }
    }
  })

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
  const where = user
    ? {
        id: user.id
      }
    : {}
  const id = req.params.id as string

  const profile = await prisma.user.findUnique({
    where: {
      id
    },
    include: {
      _count: {
        select: {
          posts: true,
          follows: true,
          followers: {
            where: {
              NOT: where
            }
          }
        }
      },
      followers: {
        where
      }
    }
  })

  if (profile === null) {
    res.status(404).send('Not found')
    return
  }

  const refined = refineUser(profile)
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

const getFollowers: RequestHandler = async (req, res) => {
  const id = req.params.id as string

  const followers = await prisma.user.findMany({
    where: {
      follows: {
        every: {
          id
        }
      }
    }
  })

  res.json(followers)
}

const getFollows: RequestHandler = async (req, res) => {
  const id = req.params.id as string

  const follows = await prisma.user.findMany({
    where: {
      followers: {
        every: {
          id
        }
      }
    }
  })

  res.json(follows)
}

const changeFollow = (action: 'connect' | 'disconnect') => {
  const change: RequestHandler = async (req, res) => {
    const user = req.user as UserWithIdentities
    const id = req.params.id as string

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        follows: {
          [action]: {
            id
          }
        }
      }
    })

    res.json(true)
  }

  return change
}

const follow = changeFollow('connect')
const unfollow = changeFollow('disconnect')

export {
  connectEmail,
  createUser,
  follow,
  getFollowers,
  getFollows,
  getPosts,
  getSelf,
  getUser,
  unfollow,
  updateUser
}
