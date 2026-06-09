import type {
  CommentFindManyArgs,
  CommentWhereInput
} from '../../generated/prisma/models'
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
  parentId: string | null
) =>
  prisma.$transaction(async (tx) => {
    const comment = await tx.comment.findUnique({
      where: { id: commentId, authorId, postId, parentId, deletedAt: null }
    })

    if (!comment) {
      return false
    }

    await tx.user.update({
      where: { id: comment.authorId as string },
      data: { commentCount: { decrement: 1 } }
    })

    if (comment.childCount > 0) {
      await tx.comment.update({
        where: { id: comment.id },
        data: { authorId: null, content: null, deletedAt: new Date() }
      })
    } else {
      let postDecrement = 1

      if (parentId) {
        let parent = await tx.comment.update({
          where: { id: parentId },
          data: {
            childCount: { decrement: 1 },
            children: { delete: { id: commentId } }
          }
        })
        while (parent.deletedAt && parent.childCount === 0) {
          postDecrement++
          if (!parent.parentId) {
            await tx.comment.delete({ where: { id: parent.id } })
            break
          }
          parent = await tx.comment.update({
            where: { id: parent.parentId },
            data: {
              childCount: { decrement: 1 },
              children: { delete: { id: parent.id } }
            }
          })
        }
      } else {
        await tx.comment.delete({ where: { id: comment.id } })
      }

      await tx.post.update({
        where: { id: postId },
        data: { commentCount: { decrement: postDecrement } }
      })
    }
    return true
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

  const OR: CommentWhereInput[] = [
    { deletedAt: null },
    { childCount: { gt: 0 } }
  ]

  const where: CommentWhereInput = {
    OR: [
      ...OR,
      { children: { some: { OR } } },
      { children: { some: { children: { some: { OR } } } } }
    ]
  }

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

  const OR: CommentWhereInput[] = [
    { deletedAt: null },
    { childCount: { gt: 0 } }
  ]

  const where: CommentWhereInput = {
    OR: [
      ...OR,
      { children: { some: { OR } } },
      { children: { some: { children: { some: { OR } } } } }
    ]
  }

  return prisma.comment.findMany({
    ...args,
    where: { parentId, ...where },
    include: {
      author: true,
      likedBy: { where: { id: selfId } },
      children: {
        where,
        orderBy: args.orderBy,
        take: 2,
        include: {
          author: true,
          likedBy: { where: { id: selfId } },
          children: {
            where,
            orderBy: args.orderBy,
            take: 2,
            include: {
              author: true,
              likedBy: { where: { id: selfId } },
              children: {
                where,
                orderBy: args.orderBy,
                take: 2,
                include: {
                  author: true,
                  likedBy: { where: { id: selfId } },
                  children: { where, orderBy: args.orderBy, take: 2 }
                }
              }
            }
          }
        }
      }
    },
    take: 5
  })
}
