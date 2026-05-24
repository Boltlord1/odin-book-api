import type {
  PostFindManyArgs,
  PostInclude,
  PostOrderByWithRelationInput,
  PostWhereInput
} from '../../generated/prisma/models'
import { destroy } from '../lib/cloudinary'
import prisma from '../lib/primsa'

interface Params {
  authorId?: string
  cursor?: string
  selfId?: string
  sort?: string
}

const PostGetter = () => {
  const getInclude = (id?: string): PostInclude => {
    if (id) {
      return {
        images: true,
        author: true,
        _count: {
          select: { likedBy: { where: { NOT: { id } } }, comments: true }
        },
        likedBy: { where: { id } }
      }
    }

    return {
      images: true,
      author: true,
      _count: { select: { likedBy: true, comments: true } },
      likedBy: { where: { id: '' } }
    }
  }

  const getWhere = (authorId?: string): PostWhereInput => {
    if (!authorId) {
      return { NOT: { authorId: null } }
    }

    const where = { authorId }

    return where
  }

  const getOrderBy = (
    sort?: string
  ): PostOrderByWithRelationInput | PostOrderByWithRelationInput[] => {
    if (sort === 'top') {
      return [{ likedBy: { _count: 'desc' } }, { createdAt: 'desc' }]
    }

    return { createdAt: 'desc' }
  }

  const getCursor = (id?: string): PostFindManyArgs => {
    if (!id) {
      return {}
    }

    return { cursor: { id }, skip: 1 }
  }

  const many = async ({ authorId, cursor, selfId, sort }: Params) => {
    const where = getWhere(authorId)
    const include = getInclude(selfId)
    const orderBy = getOrderBy(sort)
    const posts = await prisma.post.findMany({
      where,
      include,
      orderBy,
      take: 10,
      ...getCursor(cursor)
    })

    return posts
  }

  const unique = async (id: string, { selfId }: Params) => {
    const include = getInclude(selfId)
    const post = await prisma.post.findUnique({ where: { id }, include })

    return post
  }

  const search = async (search: string, { cursor, selfId }: Params) => {
    const include = getInclude(selfId)
    const posts = await prisma.post.findMany({
      include,
      where: {
        AND: [
          {
            OR: [
              { title: { search } },
              { content: { search } },
              {
                AND: [
                  {
                    comments: {
                      some: {
                        AND: [
                          { content: { search } },
                          { NOT: { authorId: null } }
                        ]
                      }
                    }
                  }
                ]
              }
            ]
          },
          { NOT: { authorId: null } }
        ]
      },
      orderBy: [
        { _relevance: { fields: 'title', search, sort: 'desc' } },
        { _relevance: { fields: 'content', search, sort: 'desc' } },
        { title: 'asc' }
      ],
      take: 10,
      ...getCursor(cursor)
    })

    return posts
  }

  const deleted = async (id: string, authorId: string) => {
    const transaction = await prisma.$transaction(async (tx) => {
      const post = await tx.post.findFirst({
        where: { id, authorId },
        select: { images: true }
      })

      if (!post) {
        return null
      }

      await tx.post.update({
        where: { id },
        data: {
          authorId: null,
          title: 'Deleted post',
          content: null,
          images: { deleteMany: {} }
        }
      })

      return post.images
    })

    if (Array.isArray(transaction)) {
      destroy(transaction.map((i) => i.publicId))
    }

    return !transaction
  }

  return { many, unique, search, delete: deleted }
}

const postGetter = PostGetter()

export default postGetter
