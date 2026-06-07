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
  content: string,
  parentId?: string
) =>
  prisma.$transaction([
    prisma.comment.create({
      data: { id: shortId(), content, authorId, postId, parentId },
      include: {
        author: true,
        likedBy: { where: { id: authorId } },
        children: true
      }
    }),
    prisma.post.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } }
    }),
    prisma.user.update({
      where: { id: authorId },
      data: { commentCount: { increment: 1 } }
    }),
    ...(parentId
      ? [
          prisma.comment.update({
            where: { id: parentId },
            data: { childCount: { increment: 1 } }
          })
        ]
      : [])
  ])

export const deleteComment = (
  postId: string,
  commentId: string,
  authorId: string,
  parentId?: string
) =>
  prisma.$transaction(async (tx) => {
    const { count } = await tx.comment.updateMany({
      where: { id: commentId, authorId, postId, parentId, deletedAt: null },
      data: { authorId: null, content: null, deletedAt: new Date() }
    })

    const deleted = Boolean(count)
    if (deleted) {
      await tx.$transaction([
        tx.post.update({
          where: { id: postId },
          data: { commentCount: { decrement: 1 } }
        }),
        tx.user.update({
          where: { id: authorId },
          data: { commentCount: { decrement: 1 } }
        }),
        ...(parentId
          ? [
              tx.comment.update({
                where: { id: parentId },
                data: { childCount: { decrement: 1 } }
              })
            ]
          : [])
      ])
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

  const where = { OR: [{ deletedAt: null }, { children: { some: {} } }] }

  return prisma.comment.findMany({
    ...args,
    where: { postId, parentId: null, ...where },
    include: {
      author: true,
      likedBy: { where: { id: selfId } },
      children: {
        where,
        orderBy: args.orderBy,
        take: 5,
        include: {
          author: true,
          likedBy: { where: { id: selfId } },
          children: {
            where,
            orderBy: args.orderBy,
            take: 4,
            include: {
              author: true,
              likedBy: { where: { id: selfId } },
              children: {
                where,
                orderBy: args.orderBy,
                take: 3,
                include: {
                  author: true,
                  likedBy: { where: { id: selfId } },
                  children: {
                    where,
                    orderBy: args.orderBy,
                    take: 2,
                    include: {
                      author: true,
                      likedBy: { where: { id: selfId } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    take: 10
  })
}

export const findReplies = (
  parentId: string,
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

  const where = { OR: [{ deletedAt: null }, { children: { some: {} } }] }

  return prisma.comment.findMany({
    ...args,
    where: { parentId, ...where },
    include: {
      author: true,
      likedBy: { where: { id: selfId } },
      children: {
        where,
        orderBy: args.orderBy,
        take: 3,
        include: { author: true, likedBy: { where: { id: selfId } } }
      }
    },
    take: 5
  })
}
