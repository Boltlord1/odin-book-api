import type {
  CommentCreateInput,
  CommentFindManyArgs,
  CommentInclude,
  CommentOrderByWithRelationInput,
  ReplyCreateInput,
  ReplyFindManyArgs,
  ReplyInclude
} from '../../generated/prisma/models'
import prisma from '../lib/primsa'

interface Params {
  cursor?: string
  selfId?: string
  sort?: string
}

const CommentGetter = () => {
  const getInclude = (id?: string): CommentInclude => {
    if (id) {
      return {
        author: true,
        replies: {
          include: getReplyInclude(id),
          orderBy: { createdAt: 'asc' },
          take: 10
        },
        _count: {
          select: { likedBy: { where: { NOT: { id } } }, replies: true }
        },
        likedBy: { where: { id } }
      }
    }

    return {
      author: true,
      replies: { include: getReplyInclude(), orderBy: { createdAt: 'asc' } },
      _count: { select: { likedBy: true } },
      likedBy: { where: { id: '' } }
    }
  }

  const getReplyInclude = (id?: string): ReplyInclude => {
    if (id) {
      return {
        author: true,
        _count: { select: { likedBy: true } },
        likedBy: { where: { id } }
      }
    }

    return {
      author: true,
      _count: { select: { likedBy: true } },
      likedBy: { where: { id: '' } }
    }
  }

  const getOrderBy = (
    sort?: string
  ): CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[] => {
    if (sort === 'top') {
      return [{ likedBy: { _count: 'asc' } }, { createdAt: 'asc' }]
    }

    return { createdAt: 'asc' }
  }

  const getCursor = (id?: string): CommentFindManyArgs | ReplyFindManyArgs => {
    if (!id) {
      return {}
    }

    return { cursor: { id }, skip: 1 }
  }

  const many = async (postId: string, { cursor, selfId, sort }: Params) => {
    const include = getInclude(selfId)
    const orderBy = getOrderBy(sort)
    const comments = await prisma.comment.findMany({
      where: { postId },
      include,
      orderBy,
      take: 10,
      ...(getCursor(cursor) as CommentFindManyArgs)
    })

    return comments
  }

  const create = async (data: CommentCreateInput) => {
    const include = getInclude()
    const comment = await prisma.comment.create({ data, include })

    return comment
  }

  const replies = async (commentId: string, { cursor, selfId }: Params) => {
    const include = getReplyInclude(selfId)
    const replies = await prisma.reply.findMany({
      where: { commentId },
      include,
      orderBy: { createdAt: 'asc' },
      take: 10,
      ...(getCursor(cursor) as ReplyFindManyArgs)
    })

    return replies
  }

  const reply = async (data: ReplyCreateInput) => {
    const include = getReplyInclude()
    const reply = await prisma.reply.create({ data, include })

    return reply
  }

  const deleted = async (id: string, authorId: string) => {
    const transaction = await prisma.$transaction(async (tx) => {
      const comment = await tx.comment.findFirst({
        where: { id, authorId },
        select: { id: true, _count: { select: { replies: true } } }
      })

      if (!comment) {
        return null
      }

      if (comment._count.replies) {
        await prisma.comment.update({
          where: { id },
          data: { authorId: null, content: 'Comment was deleted' }
        })
      } else {
        await prisma.comment.delete({ where: { id } })
      }
    })

    return transaction
  }

  return { create, many, replies, reply, delete: deleted }
}

const commentGetter = CommentGetter()

export default commentGetter
