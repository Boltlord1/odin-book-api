import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import {
  createPrivateMessage,
  findChats,
  findMessages,
  findPrivateChat
} from '../database/chat'
import type { UserWithIdentities } from '../database/user'
import { refineChat } from '../lib/refine'
import parseQuery from '../routers/query'
import type { ContentData } from '../types/body'

export const getChats: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const chats = await findChats(user.id)
  const refined = chats.map(refineChat)
  res.json(refined)
}

export const getPrivateChat: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const id = req.params.id

  if (typeof id !== 'string' || user.id === id) {
    res.status(404).end()
    return
  }

  const chat = await findPrivateChat(user.id, id)
  res.json(chat)
}

export const postPrivateMessage: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const chatId = req.params.id

  if (typeof chatId !== 'string') {
    res.status(404).end()
    return
  }

  const { content } = matchedData<ContentData>(req)
  const [message] = await createPrivateMessage(user.id, chatId, content)
  res.json(message)
}

export const getMessages: RequestHandler = async (req, res) => {
  const chatId = req.params.id
  const cursor = parseQuery(req.query.cursor)

  if (typeof chatId !== 'string') {
    res.status(404).end()
    return
  }

  const messages = await findMessages(chatId, cursor)
  res.json(messages)
}
