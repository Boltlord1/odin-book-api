import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import { deletePost, findPost, findPosts } from '../database/post'
import type { PossibleUser, UserWithIdentities } from '../database/user'
import shortId from '../lib/cuid2'
import prisma from '../lib/primsa'
import { refineLike } from '../lib/refine'
import { whitespace } from '../lib/variables'
import parseQuery from '../routers/query'
import type { PostData } from '../types/body'
import type { PostRequest } from '../types/request'

export const postPost: RequestHandler = async (req: PostRequest, res, next) => {
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

export const getPosts: RequestHandler = async (req, res) => {
  const sort = parseQuery(req.query.sort)
  const cursor = parseQuery(req.query.cursor)

  const user = req.user as PossibleUser
  const selfId = user?.id

  const posts = await findPosts({ cursor, selfId, sort })
  const refined = posts.map(refineLike)
  res.json(refined)
}

export const getPost: RequestHandler = async (req, res) => {
  const user = req.user as PossibleUser
  const postId = req.params.id as string

  const selfId = user?.id
  const post = await findPost(postId, { selfId })

  if (post === null) {
    res.status(404).end()
    return
  }

  const refined = refineLike(post)
  res.json(refined)
}

export const getSearch: RequestHandler = async (req, res, next) => {
  const search = parseQuery(req.query.search)

  if (!search) {
    next()
    return
  }

  const cursor = parseQuery(req.query.cursor)
  const user = req.user as PossibleUser
  const selfId = user?.id
  const formatted = search.trim().split(whitespace).join(' & ')
  const posts = await findPosts({ cursor, search: formatted, selfId })

  const refined = posts.map(refineLike)
  res.json(refined)
}

export const delPost: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const id = req.params.id as string

  const { count } = await deletePost(id, user.id)
  if (!count) {
    res.status(404).end()
    return
  }
  res.status(200).end()
}
