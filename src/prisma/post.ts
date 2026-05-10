import type {
  PostInclude,
  PostOrderByWithRelationInput
} from '../../generated/prisma/models'
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
      return {}
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
        OR: [
          { title: { search } },
          { content: { search } },
          { comments: { some: { content: { search } } } }
        ]
      },
      orderBy: [
        { _relevance: { fields: 'title', search, sort: 'desc' } },
        { _relevance: { fields: 'content', search, sort: 'desc' } }
      ]
    })

    return posts
  }

  return { many, unique, search }
}

const postGetter = PostGetter()

export default postGetter
