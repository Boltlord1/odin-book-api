import type {
  UserFindManyArgs,
  UserUpdateInput
} from '../../generated/prisma/models'
import shortId from '../lib/cuid2'
import prisma from '../lib/primsa'
import type { EmailIdentity } from '../types/identity'

export type UserWithIdentities = NonNullable<
  Awaited<ReturnType<typeof findSelf>>
>
export type PossibleUser = UserWithIdentities | undefined
export type Profile = NonNullable<Awaited<ReturnType<typeof findProfile>>>

export const findSelf = async (id: string) =>
  prisma.user.findUnique({ where: { id }, include: { identities: true } })

export const findUsers = (cursor?: string) => {
  const args: UserFindManyArgs = {
    orderBy: [{ followerCount: 'desc' }, { name: 'asc' }, { id: 'asc' }],
    take: 10
  }

  if (cursor) {
    args.cursor = { id: cursor }
    args.skip = 1
  }

  return prisma.user.findMany(args)
}

export const searchUsers = (contains: string, cursor?: string) => {
  const args: UserFindManyArgs = {
    where: { OR: [{ name: { contains } }, { display: { contains } }] },
    orderBy: [{ followerCount: 'desc' }, { name: 'asc' }, { id: 'asc' }],
    take: 10
  }

  if (cursor) {
    args.cursor = { id: cursor }
    args.skip = 1
  }

  return prisma.user.findMany(args)
}

export const findProfile = async (id: string, selfId?: string) =>
  prisma.user.findUnique({
    where: { id },
    include: { followers: { where: { id: selfId } } }
  })

export const createUser = (
  name: string,
  display: string,
  email: string,
  data: EmailIdentity,
  hash: string
) =>
  prisma.user.create({
    data: {
      name,
      display,
      id: shortId(),
      identities: { create: { provider: 'Email', id: email, data } },
      password: { create: { id: shortId(), hash } }
    }
  })

export const createEmail = (
  id: string,
  email: string,
  data: EmailIdentity,
  hash: string
) =>
  prisma.user.update({
    where: { id },
    data: {
      identities: { create: { provider: 'Email', id: email, data } },
      password: { create: { id: shortId(), hash } }
    }
  })

export const updateSelf = (id: string, data: UserUpdateInput) =>
  prisma.user.update({ where: { id }, data, include: { identities: true } })
