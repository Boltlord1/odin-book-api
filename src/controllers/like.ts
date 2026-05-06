import type { RequestHandler } from 'express'
import prisma from '../lib/primsa'
import type { UserWithIdentities } from '../types/prisma'

type type = 'post' | 'comment' | 'reply'
const getRow = (type: type) => {
  if (type === 'post') {
    return 'likedPosts'
  }

  if (type === 'comment') {
    return 'likedComments'
  }

  return 'likedReplies'
}

const changeLike = (type: type, action: 'connect' | 'disconnect') => {
  const change: RequestHandler = async (req, res) => {
    const user = req.user as UserWithIdentities

    const row = getRow(type)
    const id = req.params.id

    if (id === null) {
      res.status(404).send('Not found')
      return
    }

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        [`${row}`]: {
          [`${action}`]: {
            id
          }
        }
      }
    })

    res.status(202).send('Success')
  }

  return change
}

const likePost = changeLike('post', 'connect')
const unlikePost = changeLike('post', 'disconnect')
const likeComment = changeLike('comment', 'connect')
const unlikeComment = changeLike('comment', 'disconnect')
const likeReply = changeLike('reply', 'connect')
const unlikeReply = changeLike('reply', 'disconnect')

export {
  likeComment,
  likePost,
  likeReply,
  unlikeComment,
  unlikePost,
  unlikeReply
}
