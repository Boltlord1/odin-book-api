import type {
  IdentityCreateInput,
  UserFindManyArgs,
  UserInclude,
  UserUpdateInput
} from '../../generated/prisma/models'
import prisma from '../lib/primsa'

const UserGetter = () => {
  const getInclude = (id?: string): UserInclude => {
    const count = id ? { where: { NOT: { id } } } : true
    const followers = id ? { where: { id } } : true
    return {
      _count: { select: { posts: true, following: true, followers: count } },
      followers
    }
  }

  const getSelfInclude = (): UserInclude => ({
    identities: true,
    _count: { select: { posts: true, following: true, followers: true } }
  })

  const getCursor = (id?: string): UserFindManyArgs => {
    console.log(`id: ${id}`)
    if (!id) {
      return {}
    }

    return { cursor: { id }, skip: 1 }
  }

  const avatar = (id: string, avatar: string) =>
    prisma.user.update({
      where: { id },
      data: { avatar },
      include: getSelfInclude()
    })

  const create = (data: IdentityCreateInput) => prisma.identity.create({ data })

  const many = (cursor?: string) =>
    prisma.user.findMany({
      include: getInclude(),
      orderBy: [{ followers: { _count: 'desc' } }, { name: 'asc' }],
      take: 10,
      ...getCursor(cursor)
    })

  const profile = (id: string, selfId?: string) =>
    prisma.user.findUnique({ where: { id }, include: getInclude(selfId) })

  const search = (contains: string, cursor?: string) =>
    prisma.user.findMany({
      where: { OR: [{ name: { contains } }, { display: { contains } }] },
      include: getInclude(),
      orderBy: { display: 'asc' },
      take: 10,
      ...getCursor(cursor)
    })

  const self = (id: string) =>
    prisma.user.findUnique({ where: { id }, include: getSelfInclude() })

  const update = (id: string, data: UserUpdateInput) =>
    prisma.user.update({ where: { id }, data, include: getSelfInclude() })

  return { avatar, create, many, profile, search, self, update }
}

const userGetter = UserGetter()

export default userGetter
