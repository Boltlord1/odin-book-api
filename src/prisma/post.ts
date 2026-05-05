import type {
  CommentInclude,
  CommentOrderByWithRelationInput,
  PostInclude,
  PostOrderByWithRelationInput
} from '../../generated/prisma/models'
import prisma from '../lib/primsa'

const PostGetter = () => {
  const getPostInclude = (user?: string) => {
    if (user) {
      const include: PostInclude = {
        images: true,
        author: true,
        _count: {
          select: {
            likedBy: {
              where: {
                NOT: {
                  id: user
                }
              }
            },
            comments: true
          }
        },
        likedBy: {
          where: {
            id: user
          }
        }
      }

      return include
    }

    const include: PostInclude = {
      images: true,
      author: true,
      _count: {
        select: {
          likedBy: true,
          comments: true
        }
      }
    }

    return include
  }

  const getCommentInclude = (user?: string) => {
    if (user) {
      const include: CommentInclude = {
        author: true,
        _count: {
          select: {
            likedBy: {
              where: {
                NOT: {
                  id: user
                }
              }
            }
          }
        },
        likedBy: {
          where: {
            id: user
          }
        }
      }

      return include
    }

    const include: CommentInclude = {
      author: true,
      _count: {
        select: {
          likedBy: true
        }
      }
    }

    return include
  }

  const getWhere = (authorId?: string) => {
    if (!authorId) {
      return {}
    }

    const where = {
      authorId
    }

    return where
  }

  const getOrderBy = (sort: string) => {
    if (sort === 'top') {
      const orderBy:
        | PostOrderByWithRelationInput
        | CommentOrderByWithRelationInput = {
        likedBy: {
          _count: 'desc'
        }
      }

      return orderBy
    }

    const orderBy:
      | PostOrderByWithRelationInput
      | CommentOrderByWithRelationInput = {
      createdAt: 'desc'
    }

    return orderBy
  }

  const many = async (sort: string, user?: string, authorId?: string) => {
    const where = getWhere(authorId)
    const include = getPostInclude(user)
    const orderBy = getOrderBy(sort)
    const posts = await prisma.post.findMany({
      where,
      include,
      orderBy
    })

    return posts
  }

  const unique = async (id: string, user?: string) => {
    const include = getPostInclude(user)
    const post = await prisma.post.findUnique({
      where: {
        id
      },
      include
    })

    return post
  }

  const comments = async (postId: string, sort: string, user?: string) => {
    const include = getCommentInclude(user)
    const orderBy = getOrderBy(sort) as CommentOrderByWithRelationInput
    const comments = await prisma.comment.findMany({
      where: {
        postId
      },
      include,
      orderBy
    })

    return comments
  }

  return {
    many,
    unique,
    comments
  }
}

const postGetter = PostGetter()

export default postGetter
