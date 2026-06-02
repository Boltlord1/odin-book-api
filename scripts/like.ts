import prisma from '../src/lib/primsa'

const posts = await prisma.post.findMany({
  select: { _count: { select: { likedBy: true } }, id: true }
})
const comments = await prisma.comment.findMany({
  select: { _count: { select: { likedBy: true } }, id: true }
})
const replies = await prisma.reply.findMany({
  select: { _count: { select: { likedBy: true } }, id: true }
})

for (const post of posts) {
  await prisma.post.update({
    where: { id: post.id },
    data: { likes: post._count.likedBy }
  })
}

for (const comment of comments) {
  await prisma.comment.update({
    where: { id: comment.id },
    data: { likes: comment._count.likedBy }
  })
}

for (const reply of replies) {
  await prisma.reply.update({
    where: { id: reply.id },
    data: { likes: reply._count.likedBy }
  })
}
