import 'dotenv/config'
import { destroy } from '../src/lib/cloudinary'
import prisma from '../src/lib/primsa'

const images = await prisma.image.findMany()

const publicIds: string[] = []
for (const image of images) {
  publicIds.push(image.publicId)
}

await destroy(publicIds)

await prisma.comment.deleteMany()
await prisma.image.deleteMany()
await prisma.post.deleteMany()

process.exit()
