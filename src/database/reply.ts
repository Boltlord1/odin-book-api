import type { ReplyFindManyArgs } from '../../generated/prisma/models'
import shortId from '../lib/cuid2'
import prisma from '../lib/primsa'

interface Params {
  cursor?: string
  selfId?: string
}

export const createReply = (
  postId: string,
  commentId: string,
  authorId: string,
  content: string
) =>
  prisma.$transaction([
    prisma.reply.create({
      data: { id: shortId(), content, authorId, commentId },
      include: { author: true, likedBy: { where: { id: authorId } } }
    }),
    prisma.comment.update({
      where: { id: commentId },
      data: { replyCount: { increment: 1 } }
    }),
    prisma.post.update({
      where: { id: postId },
      data: { replyCount: { increment: 1 } }
    }),
    prisma.user.update({
      where: { id: authorId },
      data: { replyCount: { increment: 1 } }
    })
  ])

export const deleteReply = (
  postId: string,
  commentId: string,
  replyId: string,
  authorId: string
) =>
  prisma.$transaction(async (tx) => {
    const { count } = await tx.reply.updateMany({
      where: {
        id: replyId,
        authorId,
        comment: { id: commentId, postId },
        deletedAt: null
      },
      data: { authorId: null, content: null, deletedAt: new Date() }
    })

    const deleted = Boolean(count)
    if (deleted) {
      await tx.$transaction([
        tx.comment.update({
          where: { id: commentId },
          data: { replyCount: { decrement: 1 } }
        }),
        tx.post.update({
          where: { id: postId },
          data: { replyCount: { decrement: 1 } }
        }),
        tx.user.update({
          where: { id: authorId },
          data: { replyCount: { decrement: 1 } }
        })
      ])
    }
    return deleted
  })

export const findReplies = (commentId: string, { cursor, selfId }: Params) => {
  const args: ReplyFindManyArgs = {}
  if (cursor) {
    args.cursor = { id: cursor }
    args.skip = 1
  }

  return prisma.reply.findMany({
    ...args,
    where: { commentId },
    include: { author: true, likedBy: { where: { id: selfId } } },
    take: 10,
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }]
  })
}
