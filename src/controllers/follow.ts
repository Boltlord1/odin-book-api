import type { RequestHandler } from 'express'
import prisma from '../lib/primsa'
import type { UserWithIdentities } from '../types/prisma'

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

const getFollowing: RequestHandler = async (req, res) => {
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

export { follow, getFollowers, getFollowing, unfollow }
