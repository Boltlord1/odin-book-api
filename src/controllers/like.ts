import type { RequestHandler } from 'express'
import type {
  CommentUpdateInput,
  PostUpdateInput,
  UserListRelationFilter
} from '../../generated/prisma/models'
import type { UserWithIdentities } from '../database/user'
import prisma from '../lib/primsa'

type type = 'post' | 'comment'
const updaters = {
  post: (id: string, likedBy: UserListRelationFilter, data: PostUpdateInput) =>
    prisma.post.update({ where: { id, likedBy }, data }),
  comment: (
    id: string,
    likedBy: UserListRelationFilter,
    data: CommentUpdateInput
  ) => prisma.comment.update({ where: { id, likedBy }, data })
}

export const changeLike = (type: type, action: 'connect' | 'disconnect') => {
  const change: RequestHandler = async (req, res) => {
    const id = req.params.id

    if (typeof id !== 'string') {
      res.status(404).end()
      return
    }

    const user = req.user as UserWithIdentities
    const likeCount = action === 'connect' ? { increment: 1 } : { decrement: 1 }
    const likedBy = { [action]: { id: user.id } }
    const filter =
      action === 'connect'
        ? { none: { id: user.id } }
        : { some: { id: user.id } }
    await updaters[type](id, filter, { likeCount, likedBy })

    res.status(202).send('Success')
  }

  return change
}
