import type {
  PostInclude,
  PostOrderByWithRelationInput
} from '../../generated/prisma/models'
import { destroy } from '../lib/cloudinary'
import prisma from '../lib/primsa'

const PostGetter = () => {
  const getInclude = (user?: string) => {
    if (user) {
      const include: PostInclude = {
        images: true,
        author: true,
        _count: {
          select: { likedBy: { where: { NOT: { id: user } } }, comments: true }
        },
        likedBy: { where: { id: user } }
      }

      return include
    }

    const include: PostInclude = {
      images: true,
      author: true,
      _count: { select: { likedBy: true, comments: true } },
      likedBy: { where: { id: '' } }
    }

    return include
  }

  const getWhere = (authorId?: string) => {
    if (!authorId) {
      return { NOT: { authorId: null } }
    }

    const where = { authorId }

    return where
  }

  const getOrderBy = (sort?: string) => {
    if (sort === 'top') {
      const orderBy: PostOrderByWithRelationInput[] = [
        { likedBy: { _count: 'desc' } },
        { createdAt: 'desc' }
      ]

      return orderBy
    }

    const orderBy: PostOrderByWithRelationInput = { createdAt: 'desc' }

    return orderBy
  }

  const many = async (sort: string, user?: string, authorId?: string) => {
    const where = getWhere(authorId)
    const include = getInclude(user)
    const orderBy = getOrderBy(sort)
    const posts = await prisma.post.findMany({ where, include, orderBy })

    return posts
  }

  const unique = async (id: string, user?: string) => {
    const include = getInclude(user)
    const post = await prisma.post.findUnique({ where: { id }, include })

    return post
  }

  const search = async (search: string, user?: string) => {
    const include = getInclude(user)
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
        { _relevance: { fields: 'content', search, sort: 'desc' } }
      ]
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
