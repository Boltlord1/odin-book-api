import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import shortId from '../lib/cuid2'
import prisma from '../lib/primsa'
import { refineComment, refinePost } from '../lib/refine'
import { frontendUrl } from '../lib/variables'
import postGetter from '../prisma/post'
import type { CommentData, PostData } from '../types/body'
import type { PossibleUser, UserWithIdentities } from '../types/prisma'
import type { PostRequest } from '../types/request'

const createPost: RequestHandler = async (req: PostRequest, res, next) => {
  const user = req.user as UserWithIdentities

  const { title, content } = matchedData<PostData>(req)
  const post = await prisma.post.create({
    data: {
      id: shortId(),
      title,
      content: content || null,
      authorId: user.id
    }
  })

  const postId = post.id
  const files = req.files
  if (!(req.files && Array.isArray(files))) {
    res.redirect(`${frontendUrl}/app/post/${postId}`)
    return
  }

  req.postId = postId
  next()
}

const getPosts: RequestHandler = async (req, res) => {
  const user = req.user as PossibleUser
  const sort = req.query.sort || 'recent'

  if (typeof sort !== 'string') {
    res.status(400).send('Invalid query')
    return
  }

  const posts = await postGetter.many(sort, user?.id)
  const refined = posts.map(refinePost)
  res.json(refined)
}

const getPost: RequestHandler = async (req, res) => {
  const user = req.user as PossibleUser
  const postId = req.params.id as string
  const post = await postGetter.unique(postId, user?.id)

  if (post === null) {
    res.status(404).send('Not found')
    return
  }

  const refined = refinePost(post)
  res.json(refined)
}

const createComment: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const postId = req.params.id as string

  const { content } = matchedData<CommentData>(req)
  const comment = await prisma.comment.create({
    data: {
      id: shortId(),
      content,
      postId,
      authorId: user.id
    },
    include: {
      author: true
    }
  })

  res.status(201).json(comment)
}

const getComments: RequestHandler = async (req, res) => {
  const user = req.user as PossibleUser
  const postId = req.params.id as string
  const sort = req.query.sort || 'recent'

  if (typeof sort !== 'string') {
    res.status(400).send('Invalid query')
    return
  }

  const comments = await postGetter.comments(postId, sort, user?.id)
  const refined = comments.map(refineComment)
  res.json(refined)
}

const changeLike = (
  type: 'post' | 'comment',
  action: 'connect' | 'disconnect'
) => {
  const change: RequestHandler = async (req, res) => {
    const user = req.user as UserWithIdentities
    const postId = req.params.id as string
    const commentId = req.params.comment as string

    const row = type === 'post' ? 'likedPosts' : 'likedComments'
    const id = type === 'post' ? postId : commentId
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

export {
  createComment,
  createPost,
  getComments,
  getPost,
  getPosts,
  likeComment,
  likePost,
  unlikeComment,
  unlikePost
}
