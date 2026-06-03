import type { MessageFindManyArgs } from '../../generated/prisma/models'
import shortId from '../lib/cuid2'
import prisma from '../lib/primsa'

export const findChats = (id: string) =>
  prisma.chat.findMany({
    where: { visibileTo: { some: { id } } },
    include: {
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      users: { where: { NOT: { id } } }
    }
  })

export const hideChat = (id: string, selfId: string) =>
  prisma.chat.update({
    where: { id },
    data: { visibileTo: { disconnect: { id: selfId } } }
  })

export const findPrivateChat = (userId: string, otherId: string) =>
  prisma.$transaction(async (tx) => {
    const id = [userId, otherId].sort().join(':')
    const chat = await tx.chat.findUnique({
      where: { id },
      include: { users: { where: { id: otherId } } }
    })

    if (chat) {
      return chat
    }

    return tx.chat.create({
      data: {
        id,
        type: 'Private',
        users: { connect: [{ id: userId }, { id: otherId }] }
      },
      include: { users: { where: { id: otherId } } }
    })
  })

export const createMessage = async (
  authorId: string,
  chatId: string,
  content: string
) =>
  prisma.$transaction(async (tx) => {
    const users = await tx.user.findMany({
      where: { chats: { some: { id: chatId } } },
      select: { id: true }
    })

    return tx.$transaction([
      tx.message.create({ data: { id: shortId(), chatId, authorId, content } }),
      tx.chat.update({
        where: { id: chatId },
        data: { messageCount: { increment: 1 }, visibileTo: { set: users } }
      })
    ])
  })

export const findMessages = (chatId: string, cursor?: string) => {
  const args: MessageFindManyArgs = {}

  if (cursor) {
    args.cursor = { id: cursor }
    args.skip = 1
  }

  return prisma.message.findMany({
    ...args,
    where: { chatId },
    orderBy: { createdAt: 'desc' },
    take: 50
  })
}
