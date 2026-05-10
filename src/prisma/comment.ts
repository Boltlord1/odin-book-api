import type {
  CommentCreateInput,
  CommentInclude,
  CommentOrderByWithRelationInput,
  ReplyCreateInput,
  ReplyInclude
} from '../../generated/prisma/models'
import prisma from '../lib/primsa'

const CommentGetter = () => {
  const getInclude = (user?: string) => {
    if (user) {
      const include: CommentInclude = {
        author: true,
        replies: {
          include: getReplyInclude(user),
          orderBy: { createdAt: 'asc' }
        },
        _count: { select: { likedBy: { where: { NOT: { id: user } } } } },
        likedBy: { where: { id: user } }
      }

      return include
    }

    const include: CommentInclude = {
      author: true,
      replies: { include: getReplyInclude(), orderBy: { createdAt: 'asc' } },
      _count: { select: { likedBy: true } },
      likedBy: { where: { id: '' } }
    }

    return include
  }

  const getReplyInclude = (user?: string) => {
    if (user) {
      const include: ReplyInclude = {
        author: true,
        _count: { select: { likedBy: true } },
        likedBy: { where: { id: '' } }
      }

      return include
    }

    const include: ReplyInclude = {
      author: true,
      _count: { select: { likedBy: true } },
      likedBy: { where: { id: '' } }
    }

    return include
  }

  const getOrderBy = (sort?: string) => {
    if (sort === 'top') {
      const orderBy: CommentOrderByWithRelationInput[] = [
        { likedBy: { _count: 'desc' } },
        { createdAt: 'desc' }
      ]

      return orderBy
    }

    const orderBy: CommentOrderByWithRelationInput = { createdAt: 'desc' }

    return orderBy
  }

  const many = async (postId: string, sort?: string, user?: string) => {
    const include = getInclude(user)
    const orderBy = getOrderBy(sort)
    const comments = await prisma.comment.findMany({
      where: { postId },
      include,
      orderBy
    })

    return comments
  }

  const create = async (data: CommentCreateInput) => {
    const include = getInclude()
    const comment = await prisma.comment.create({ data, include })

    return comment
  }

  const reply = async (data: ReplyCreateInput) => {
    const include = getReplyInclude()
    const reply = await prisma.reply.create({ data, include })

    return reply
  }

  return { create, many, reply }
}

const commentGetter = CommentGetter()

export default commentGetter
