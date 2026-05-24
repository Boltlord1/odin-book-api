import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import shortId from '../lib/cuid2'
import prisma from '../lib/primsa'
import { refinePost } from '../lib/refine'
import { whitespace } from '../lib/variables'
import postGetter from '../prisma/post'
import parseQuery from '../routers/query'
import type { PostData } from '../types/body'
import type { PossibleUser, UserWithIdentities } from '../types/prisma'
import type { PostRequest } from '../types/request'

const createPost: RequestHandler = async (req: PostRequest, res, next) => {
  const user = req.user as UserWithIdentities

  const { title, content } = matchedData<PostData>(req)
  const post = await prisma.post.create({
    data: { id: shortId(), title, content: content || null, authorId: user.id },
    select: { id: true }
  })

  const postId = post.id
  const files = req.files
  if (!(req.files && Array.isArray(files))) {
    res.status(201).json(postId)
    return
  }

  req.postId = postId
  next()
}

const getPosts: RequestHandler = async (req, res) => {
  const sort = parseQuery(req.query.sort) || 'recent'
  const cursor = parseQuery(req.query.cursor)

  const user = req.user as PossibleUser
  const selfId = user?.id

  const posts = await postGetter.many({ sort, cursor, selfId })
  const refined = posts.map(refinePost)
  res.json(refined)
}

const getPost: RequestHandler = async (req, res) => {
  const user = req.user as PossibleUser
  const postId = req.params.id as string

  const selfId = user?.id
  const post = await postGetter.unique(postId, { selfId })

  if (post === null) {
    res.status(404).send('Not found')
    return
  }

  const refined = refinePost(post)
  res.json(refined)
}

const searchPosts: RequestHandler = async (req, res, next) => {
  const search = parseQuery(req.query.search)
  const cursor = parseQuery(req.query.cursor)

  if (!search) {
    next()
    return
  }

  const user = req.user as PossibleUser
  const selfId = user?.id
  const formatted = search.trim().split(whitespace).join(' & ')
  const posts = await postGetter.search(formatted, { cursor, selfId })

  const refined = posts.map(refinePost)
  res.json(refined)
}

const deletePost: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const id = req.params.id as string

  const bool = await postGetter.delete(id, user.id)

  if (bool) {
    res.status(404).end()
    return
  }

  res.status(200).end()
}

export { createPost, deletePost, getPost, getPosts, searchPosts }
