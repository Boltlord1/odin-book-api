import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import type { CommentCreateInput } from '../../generated/prisma/models'
import shortId from '../lib/cuid2'
import { refineComment } from '../lib/refine'
import commentGetter from '../prisma/comment'
import parseQuery from '../routers/query'
import type { ContentData } from '../types/body'
import type { PossibleUser, UserWithIdentities } from '../types/prisma'

const createComment: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const postId = req.params.id as string

  const { content } = matchedData<ContentData>(req)
  const data: CommentCreateInput = {
    id: shortId(),
    content,
    post: { connect: { id: postId } },
    author: { connect: { id: user.id } }
  }
  const comment = await commentGetter.create(data)

  const refined = refineComment(comment)
  res.status(201).json(refined)
}

const getComments: RequestHandler = async (req, res) => {
  const user = req.user as PossibleUser
  const postId = req.params.id as string

  const sort = parseQuery(req.query.sort) || 'recent'
  const cursor = parseQuery(req.query.cursor)

  const selfId = user?.id
  const comments = await commentGetter.many(postId, { cursor, selfId, sort })

  const refined = comments.map(refineComment)
  res.json(refined)
}

const deleteComment: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const id = req.params.id as string

  const bool = await commentGetter.delete(id, user.id)

  if (bool) {
    res.status(403).end()
    return
  }

  res.status(200).end()
}

export { createComment, deleteComment, getComments }
