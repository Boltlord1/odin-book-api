import type { RequestHandler } from 'express'
import { findPosts } from '../database/post'
import {
  findProfile,
  findUsers,
  type PossibleUser,
  searchUsers
} from '../database/user'
import { refineLike } from '../lib/refine'
import { whitespace } from '../lib/variables'
import parseQuery from '../routers/query'

export const getProfile: RequestHandler = async (req, res) => {
  const user = req.user as PossibleUser
  const id = req.params.id as string

  const profile = await findProfile(id, user?.id)

  if (profile === null) {
    res.status(404).end()
    return
  }

  res.json(profile)
}

export const getUsers: RequestHandler = async (req, res) => {
  const cursor = parseQuery(req.query.cursor)
  const users = await findUsers(cursor)

  res.json(users)
}

export const getSearch: RequestHandler = async (req, res, next) => {
  const search = parseQuery(req.query.search)

  if (!search) {
    next()
    return
  }

  const cursor = parseQuery(req.query.cursor)
  const formatted = search.trim().split(whitespace).join(' & ')
  const users = await searchUsers(formatted, cursor)
  res.json(users)
}

export const getPosts: RequestHandler = async (req, res) => {
  const user = req.user as PossibleUser
  const authorId = req.params.id as string

  const sort = parseQuery(req.query.sort) || 'recent'
  const cursor = parseQuery(req.query.cursor)

  const selfId = user?.id
  const posts = await findPosts({ authorId, cursor, sort, selfId })

  const refined = posts.map(refineLike)
  res.json(refined)
}
