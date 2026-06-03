import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import {
  createMessage,
  findChats,
  findMessages,
  findPrivateChat,
  hideChat
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

export const putHideChat: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const chatId = req.params.id as string

  await hideChat(chatId, user.id)
  res.status(200).end()
}

export const getPrivateChat: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const id = req.params.id as string

  const chat = await findPrivateChat(user.id, id)
  const refined = refineChat(chat)
  res.json(refined)
}

export const postMessage: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const chatId = req.params.id

  if (typeof chatId !== 'string') {
    res.status(404).end()
    return
  }

  const { content } = matchedData<ContentData>(req)
  const [message] = await createMessage(user.id, chatId, content)
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
