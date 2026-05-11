import type {
  IdentityCreateInput,
  UserInclude,
  UserUpdateInput
} from '../../generated/prisma/models'
import prisma from '../lib/primsa'

const UserGetter = () => {
  const getInclude = (user?: string): UserInclude => {
    const count = user ? { where: { NOT: { id: user } } } : true
    const followers = user ? { where: { id: user } } : true
    return {
      _count: { select: { posts: true, following: true, followers: count } },
      followers
    }
  }

  const getSelfInclude = (): UserInclude => ({
    identities: true,
    _count: { select: { posts: true, following: true, followers: true } }
  })

  const avatar = (id: string, avatar: string) =>
    prisma.user.update({
      where: { id },
      data: { avatar },
      include: getSelfInclude()
    })

  const create = (data: IdentityCreateInput) => prisma.identity.create({ data })

  const many = () =>
    prisma.user.findMany({
      include: getInclude(),
      orderBy: { followers: { _count: 'desc' } }
    })

  const profile = (id: string, user?: string) =>
    prisma.user.findUnique({ where: { id }, include: getInclude(user) })

  const search = (contains: string) =>
    prisma.user.findMany({
      where: { OR: [{ name: { contains } }, { display: { contains } }] },
      include: getInclude(),
      orderBy: { display: 'asc' }
    })

  const self = (id: string) =>
    prisma.user.findUnique({ where: { id }, include: getSelfInclude() })

  const update = (id: string, data: UserUpdateInput) =>
    prisma.user.update({ where: { id }, data, include: getSelfInclude() })

  return { avatar, create, many, profile, search, self, update }
}

const userGetter = UserGetter()

export default userGetter
