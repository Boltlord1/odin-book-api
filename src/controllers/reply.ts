import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import { createReply, deleteReply, findReplies } from '../database/reply'
import type { PossibleUser, UserWithIdentities } from '../database/user'
import { refineLike } from '../lib/refine'
import parseQuery from '../routers/query'
import type { ContentData } from '../types/body'

const postReply: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const postId = parseQuery(req.query.post)
  const commentId = req.params.id as string

  if (!postId) {
    res.status(404).end()
    return
  }

  const { content } = matchedData<ContentData>(req)
  const [reply] = await createReply(postId, commentId, user.id, content)

  const refined = refineLike(reply)
  res.status(201).json(refined)
}

const getReplies: RequestHandler = async (req, res) => {
  const user = req.user as PossibleUser
  const commentId = req.params.id as string
  const cursor = parseQuery(req.query.cursor)

  const selfId = user?.id
  const replies = await findReplies(commentId, { cursor, selfId })

  const refined = replies.map(refineLike)
  res.json(refined)
}

const delReply: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const postId = parseQuery(req.query.post)
  const commentId = parseQuery(req.query.comment)
  const replyId = req.params.id as string

  if (!(postId && commentId)) {
    res.status(400).end()
    return
  }

  const deleted = await deleteReply(replyId, user.id, postId, commentId)
  if (deleted) {
    res.status(200).end()
    return
  }
  res.status(404).end()
}

export { delReply, getReplies, postReply }
