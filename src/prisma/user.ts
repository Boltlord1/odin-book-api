import type {
  IdentityCreateInput,
  UserInclude,
  UserUpdateInput,
  UserWhereInput
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

  const getWhere = (user?: string): UserWhereInput =>
    user ? { NOT: { id: user } } : {}

  const avatar = (id: string, avatar: string) =>
    prisma.user.update({
      where: { id },
      data: { avatar },
      include: getSelfInclude()
    })

  const create = (data: IdentityCreateInput) => prisma.identity.create({ data })

  const many = () =>
    prisma.user.findMany({
      orderBy: { followers: { _count: 'desc' } },
      include: getInclude()
    })

  const profile = (id: string, user?: string) =>
    prisma.user.findUnique({ where: { id }, include: getInclude(user) })

  const search = (search: string, user?: string) =>
    prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: search } },
              { display: { contains: search } }
            ]
          },
          getWhere(user)
        ]
      },
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
