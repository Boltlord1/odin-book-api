import type {
  PostFindManyArgs,
  PostWhereInput
} from '../../generated/prisma/models'
import prisma from '../lib/primsa'

interface Params {
  authorId?: string
  cursor?: string
  search?: string
  selfId?: string
  sort?: string
}

export const deletePost = (id: string, authorId: string) =>
  prisma.post.updateMany({ where: { id, authorId }, data: { deleted: true } })

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
  const where: PostWhereInput = { deleted: false }
  if (authorId) {
    where.authorId = authorId
  }
  if (search) {
    where.OR = [
      { title: { search } },
      { content: { search } },
      { comments: { some: { content: { search }, deleted: false } } }
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
