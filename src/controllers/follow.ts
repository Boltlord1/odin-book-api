import type { RequestHandler } from 'express'
import type { UserWithIdentities } from '../database/user'
import prisma from '../lib/primsa'

const changeFollow = (action: 'connect' | 'disconnect') => {
  const change: RequestHandler = async (req, res) => {
    const user = req.user as UserWithIdentities
    const id = req.params.id as string

    const count = action === 'connect' ? { increment: 1 } : { decrement: 1 }
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { followingCount: count, following: { [action]: { id } } }
      }),
      prisma.user.update({ where: { id }, data: { followerCount: count } })
    ])

    res.json(true)
  }

  return change
}

const follow = changeFollow('connect')
const unfollow = changeFollow('disconnect')

const getFollowers: RequestHandler = async (req, res) => {
  const id = req.params.id as string

  const followers = await prisma.user.findMany({
    where: { following: { every: { id } } }
  })

  res.json(followers)
}

const getFollowing: RequestHandler = async (req, res) => {
  const id = req.params.id as string

  const following = await prisma.user.findMany({
    where: { followers: { every: { id } } }
  })

  res.json(following)
}

export { follow, getFollowers, getFollowing, unfollow }
