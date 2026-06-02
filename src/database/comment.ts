import type { CommentFindManyArgs } from '../../generated/prisma/models'
import shortId from '../lib/cuid2'
import prisma from '../lib/primsa'

export interface Params {
  cursor?: string
  selfId?: string
  sort?: string
}

export const createComment = (
  postId: string,
  authorId: string,
  content: string
) =>
  prisma.$transaction([
    prisma.comment.create({
      data: { id: shortId(), content, authorId, postId },
      include: { author: true, likedBy: { where: { id: authorId } } }
    }),
    prisma.post.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } }
    })
  ])

export const deleteComment = (
  postId: string,
  commentId: string,
  authorId: string
) =>
  prisma.$transaction(async (tx) => {
    const { count } = await tx.comment.updateMany({
      where: { id: commentId, authorId, postId, deleted: false },
      data: { deleted: true }
    })

    const deleted = Boolean(count)
    if (deleted) {
      await tx.post.update({
        where: { id: postId },
        data: { commentCount: { decrement: 1 } }
      })
    }
    return deleted
  })

export const findComments = (
  postId: string,
  { cursor, selfId, sort }: Params
) => {
  const args: CommentFindManyArgs = {}
  if (cursor) {
    args.cursor = { id: cursor }
    args.skip = 1
  }

  if (sort === 'top') {
    args.orderBy = [{ likeCount: 'desc' }, { createdAt: 'desc' }, { id: 'asc' }]
  } else {
    args.orderBy = [{ createdAt: 'desc' }, { id: 'asc' }]
  }

  return prisma.comment.findMany({
    ...args,
    where: { deleted: false, postId },
    include: { author: true, likedBy: { where: { id: selfId } } },
    take: 10
  })
}
