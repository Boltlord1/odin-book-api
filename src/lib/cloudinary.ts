import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'
import type { ServerError } from '../types/error'

const cloud_name = `${process.env.CLOUD_NAME}`
const api_key = `${process.env.CLOUD_KEY}`
const api_secret = `${process.env.CLOUD_SECRET}`

cloudinary.config({ cloud_name, api_key, api_secret })

const avatarFolder = `${process.env.AVATAR_FOLDER}`
const postFolder = `${process.env.POST_FOLDER}`

const avatar = async (file: Express.Multer.File) => {
  const b64 = Buffer.from(file.buffer).toString('base64')
  const dataURI = `data:${file.mimetype};base64,${b64}`

  try {
    const response = await cloudinary.uploader.upload(dataURI, {
      folder: avatarFolder,
      resource_type: 'image'
    })
    return response.public_id
  } catch (err) {
    console.log(err)
    const error: ServerError = { type: 'server', msg: 'Error uploading avatar' }
    return error
  }
}

const images = async (files: Express.Multer.File[]) => {
  const promises: Promise<UploadApiResponse>[] = []
  for (const file of files) {
    const b64 = Buffer.from(file.buffer).toString('base64')
    const dataURI = `data:${file.mimetype};base64,${b64}`

    const promise = cloudinary.uploader.upload(dataURI, {
      folder: postFolder,
      resource_type: 'auto'
    })
    promises.push(promise)
  }

  const responses = await Promise.allSettled(promises)

  const fulfilled = responses.filter((r) => r.status === 'fulfilled')
  const rejected = responses.filter((r) => r.status === 'rejected')

  if (rejected.length > 0) {
    const destroy = fulfilled.map((r) =>
      cloudinary.uploader.destroy(r.value.public_id)
    )
    await Promise.all(destroy)

    const error: ServerError = { type: 'server', msg: 'Error uploading images' }
    return error
  }

  return fulfilled.map(({ value }) => ({
    publicId: value.public_id,
    width: value.width,
    height: value.height
  }))
}

const url = async (url: string) => {
  try {
    const response = await cloudinary.uploader.upload(url, {
      folder: avatarFolder,
      resource_type: 'image'
    })
    return response.public_id
  } catch (err) {
    console.log(err)
    const error: ServerError = { type: 'server', msg: 'Error uploading avatar' }
    return error
  }
}

const destroy = async (id: string | string[]) => {
  if (typeof id === 'string') {
    await cloudinary.uploader.destroy(id)
    return
  }

  await Promise.all(id.map((id) => cloudinary.uploader.destroy(id)))
}

export { avatar, destroy, images, url }
