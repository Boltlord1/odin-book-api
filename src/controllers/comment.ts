import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import type { CommentCreateInput } from '../../generated/prisma/models'
import shortId from '../lib/cuid2'
import { refineComment } from '../lib/refine'
import commentGetter from '../prisma/comment'
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
  const sort = req.query.sort || 'recent'

  if (typeof sort !== 'string') {
    res.status(400).send('Invalid query')
    return
  }

  const comments = await commentGetter.many(postId, sort, user?.id)
  const refined = comments.map(refineComment)
  res.json(refined)
}

export { createComment, getComments }
