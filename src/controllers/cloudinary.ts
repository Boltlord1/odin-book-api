import type { RequestHandler } from 'express'
import { avatar, destroy, images, url } from '../lib/cloudinary'
import shortId from '../lib/cuid2'
import prisma from '../lib/primsa'
import { refineSelf } from '../lib/refine'
import type { UserWithIdentities } from '../types/prisma'
import type {
  AvatarRequest,
  PostRequest,
  UserIdRequest
} from '../types/request'
import type { TempPayload } from '../types/temp'

const uploadAvatar: RequestHandler = async (req: UserIdRequest, res, next) => {
  const file = req.file
  if (!file) {
    next()
    return
  }

  const result = await avatar(file)
  if (typeof result !== 'string') {
    res.status(502).json(result)
    return
  }

  const id = req.userId as string
  await prisma.user.update({
    where: {
      id
    },
    data: {
      avatar: result
    }
  })
  next()
}

const uploadAuto: RequestHandler = async (req: AvatarRequest, res, next) => {
  const payload = req.user as TempPayload
  const result = await url(payload.avatar)
  if (typeof result !== 'string') {
    res.status(502).json(result)
    return
  }

  req.avatar = result
  next()
}

const uploadImages: RequestHandler = async (req: PostRequest, res) => {
  const files = req.files as Express.Multer.File[]

  const result = await images(files)
  if (!Array.isArray(result)) {
    res.status(502).json(result)
    return
  }

  const postId = req.postId as string
  await prisma.image.createMany({
    data: result.map(r => ({
      ...r,
      postId,
      id: shortId()
    }))
  })

  res.json(postId)
}

const updateAvatar: RequestHandler = async (req, res) => {
  const file = req.file as Express.Multer.File

  const result = await avatar(file)
  if (typeof result !== 'string') {
    res.status(502).json(result)
    return
  }

  const user = req.user as UserWithIdentities
  const updated = await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      avatar: result
    },
    include: {
      identities: true,
      _count: {
        select: {
          posts: true,
          follows: true,
          followers: true
        }
      }
    }
  })
  await destroy(user.avatar)

  const refined = refineSelf(updated)
  res.json(refined)
}

export { updateAvatar, uploadAuto, uploadAvatar, uploadImages }
