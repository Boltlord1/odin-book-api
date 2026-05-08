import type { RequestHandler } from 'express'
import { matchedData } from 'express-validator'
import shortId from '../lib/cuid2'
import prisma from '../lib/primsa'
import { refineChat, refineChatMinimal, refineMessage } from '../lib/refine'
import type { ContentData } from '../types/body'
import type { UserWithIdentities } from '../types/prisma'

const getChats: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities

  const chats = await prisma.chat.findMany({
    where: { users: { some: { id: user.id } } },
    include: {
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      users: { where: { NOT: { id: user.id } } },
      _count: { select: { messages: true } }
    }
  })

  const refined = chats.map(refineChatMinimal)
  res.json(refined)
}

const getChat: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const id = req.params.id

  if (typeof id !== 'string') {
    res.status(404).send('Invalid parameter')
    return
  }

  const hash = [user.id, id].sort().join(':')

  const chat = await prisma.chat.upsert({
    where: { hash },
    update: {},
    create: {
      id: shortId(),
      hash,
      users: { connect: [{ id: user.id }, { id }] }
    },
    include: {
      messages: { orderBy: { createdAt: 'desc' } },
      users: { where: { NOT: { id: user.id } } },
      _count: { select: { messages: true } }
    }
  })

  const refined = refineChat(chat)
  res.json(refined)
}

const createMessage: RequestHandler = async (req, res) => {
  const user = req.user as UserWithIdentities
  const id = req.params.id

  if (typeof id !== 'string') {
    return
  }

  const { content } = matchedData<ContentData>(req)
  const message = await prisma.message.create({
    data: { id: shortId(), authorId: user.id, chatId: id, content }
  })

  const refined = refineMessage(message, user.id, true)
  res.json(refined)
}

export { createMessage, getChat, getChats }
