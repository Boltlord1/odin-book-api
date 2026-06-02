import type { RequestHandler } from 'express'
import type {
  CommentUpdateInput,
  PostUpdateInput,
  ReplyUpdateInput
} from '../../generated/prisma/models'
import type { UserWithIdentities } from '../database/user'
import prisma from '../lib/primsa'

type type = 'post' | 'comment' | 'reply'
const updaters = {
  post: (id: string, data: PostUpdateInput) =>
    prisma.post.update({ where: { id }, data }),
  comment: (id: string, data: CommentUpdateInput) =>
    prisma.comment.update({ where: { id }, data }),
  reply: (id: string, data: ReplyUpdateInput) =>
    prisma.reply.update({ where: { id }, data })
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
    await updaters[type](id, { likeCount, likedBy })

    res.status(202).send('Success')
  }

  return change
}
