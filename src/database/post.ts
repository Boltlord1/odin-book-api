import type {
  PostFindManyArgs,
  PostWhereInput
} from '../../generated/prisma/models'
import shortId from '../lib/cuid2'
import prisma from '../lib/primsa'

interface Params {
  authorId?: string
  cursor?: string
  search?: string
  selfId?: string
  sort?: string
}

export const createPost = (authorId: string, title: string, content?: string) =>
  prisma.$transaction([
    prisma.post.create({
      data: { id: shortId(), authorId, title, content: content || null },
      select: { id: true }
    }),
    prisma.user.update({
      where: { id: authorId },
      data: { postCount: { increment: 1 } }
    })
  ])

export const rollbackPost = (id: string, authorId: string) =>
  prisma.user.update({
    where: { id: authorId },
    data: { posts: { delete: { id } }, postCount: { decrement: 1 } }
  })

export const deletePost = (id: string, authorId: string) =>
  prisma.$transaction(async (tx) => {
    const { count } = await tx.post.updateMany({
      where: { id, authorId, deletedAt: null },
      data: {
        title: null,
        content: null,
        authorId: null,
        deletedAt: new Date()
      }
    })

    const deleted = Boolean(count)
    if (deleted) {
      await prisma.user.update({
        where: { id: authorId },
        data: { postCount: { decrement: 1 } }
      })
    }
    return deleted
  })

export const findPost = (id: string, { selfId }: Params) =>
  prisma.post.findUnique({
    where: { id },
    include: { images: true, author: true, likedBy: { where: { id: selfId } } }
  })

export const findPosts = ({
  authorId,
  cursor,
  search,
  selfId,
  sort
}: Params) => {
  const where: PostWhereInput = { deletedAt: null }
  if (authorId) {
    where.authorId = authorId
  }
  if (search) {
    where.OR = [
      { title: { search } },
      { content: { search } },
      { comments: { some: { content: { search } } } }
    ]
  }

  const args: PostFindManyArgs = {}

  if (cursor) {
    args.cursor = { id: cursor }
    args.skip = 1
  }

  if (search) {
    args.orderBy = [
      { _relevance: { fields: 'title', search, sort: 'desc' } },
      { _relevance: { fields: 'content', search, sort: 'desc' } },
      { id: 'asc' }
    ]
  } else if (sort === 'top') {
    args.orderBy = [{ likeCount: 'desc' }, { createdAt: 'desc' }, { id: 'asc' }]
  } else {
    args.orderBy = [{ createdAt: 'desc' }, { id: 'asc' }]
  }

  return prisma.post.findMany({
    ...args,
    where,
    include: { images: true, author: true, likedBy: { where: { id: selfId } } },
    take: 10
  })
}
