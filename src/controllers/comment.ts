import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import {
  createComment,
  deleteComment,
  findComments,
  findReplies
} from '../database/comment'
import type { PossibleUser, UserWithIdentities } from '../database/user'
import parseQuery from '../lib/query'
import { refineComment } from '../lib/refine'
import type { ContentData } from '../types/body'

export const postComment: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const postId = req.params.id as string

  const parentId = parseQuery(req.query.parent)
  const { content } = matchedData<ContentData>(req)
  const [comment] = await createComment(postId, user.id, content, parentId)

  const refined = refineComment(comment)
  res.status(201).json(refined)
}

export const getComments: RequestHandler = async (req, res) => {
  const user = req.user as PossibleUser
  const postId = req.params.id as string

  const sort = parseQuery(req.query.sort)
  const cursor = parseQuery(req.query.cursor)

  const selfId = user?.id
  const comments = await findComments(postId, { cursor, selfId, sort })

  const refined = comments.map(refineComment)
  res.json(refined)
}

export const delComment: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const postId = parseQuery(req.query.post)
  const commentId = req.params.id as string

  if (!postId) {
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

export const getReplies: RequestHandler = async (req, res) => {
  const user = req.user as PossibleUser
  const parentId = req.params.id as string

  const sort = parseQuery(req.query.sort)
  const cursor = parseQuery(req.query.cursor)

  const selfId = user?.id
  const comments = await findReplies(parentId, { cursor, selfId, sort })

  const refined = comments.map(refineComment)
  res.json(refined)
}
