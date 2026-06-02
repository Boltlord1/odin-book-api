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

export const findPrivateChat = (userId: string, otherId: string) =>
  prisma.$transaction(async (tx) => {
    const id = [userId, otherId].sort().join(':')
    const chat = await tx.chat.findFirst({
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

export const createPrivateMessage = (
  authorId: string,
  chatId: string,
  content: string
) => {
  const otherId = chatId.split(':').find((id) => id !== authorId) as string

  return prisma.$transaction([
    prisma.message.create({
      data: { id: shortId(), authorId, chatId, content }
    }),
    prisma.chat.update({
      where: { id: chatId, users: { some: { id: authorId } } },
      data: {
        visibileTo: { connect: [{ id: authorId }, { id: otherId }] },
        messageCount: { increment: 1 }
      }
    })
  ])
}

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
