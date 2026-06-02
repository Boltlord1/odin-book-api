import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import { createComment, deleteComment, findComments } from '../database/comment'
import type { PossibleUser, UserWithIdentities } from '../database/user'
import { refineLike } from '../lib/refine'
import parseQuery from '../routers/query'
import type { ContentData } from '../types/body'

const postComment: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const postId = req.params.id as string

  const { content } = matchedData<ContentData>(req)
  const [comment] = await createComment(postId, user.id, content)

  const refined = refineLike(comment)
  res.status(201).json(refined)
}

const getComments: RequestHandler = async (req, res) => {
  const user = req.user as PossibleUser
  const postId = req.params.id as string

  const sort = parseQuery(req.query.sort)
  const cursor = parseQuery(req.query.cursor)

  const selfId = user?.id
  const comments = await findComments(postId, { cursor, selfId, sort })

  const refined = comments.map(refineLike)
  res.json(refined)
}

const delComment: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const postId = parseQuery(req.query.post)
  const commentId = req.params.comment

  if (!postId || typeof commentId !== 'string') {
    res.status(400).end()
    return
  }

  const deleted = await deleteComment(postId, commentId, user.id)
  if (deleted) {
    res.status(200).end()
    return
  }
  res.status(403).end()
}

export { delComment, getComments, postComment }
