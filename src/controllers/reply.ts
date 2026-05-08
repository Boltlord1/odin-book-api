import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import type { ReplyCreateInput } from '../../generated/prisma/models'
import shortId from '../lib/cuid2'
import { refineReply } from '../lib/refine'
import commentGetter from '../prisma/comment'
import type { ContentData } from '../types/body'
import type { UserWithIdentities } from '../types/prisma'

const createReply: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const commentId = req.params.id as string

  const { content } = matchedData<ContentData>(req)
  const data: ReplyCreateInput = {
    id: shortId(),
    content,
    comment: {
      connect: {
        id: commentId
      }
    },
    author: {
      connect: {
        id: user.id
      }
    }
  }

  const reply = await commentGetter.reply(data)
  const refined = refineReply(reply)
  res.status(201).json(refined)
}

export { createReply }
