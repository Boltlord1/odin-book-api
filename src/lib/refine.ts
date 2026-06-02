interface FollowParam {
  followerCount: number
  followers: unknown[]
}

export const refineFollow = <T extends FollowParam>(obj: T) => {
  const { followers, ...rest } = obj
  const followed = !!followers.length
  const followerCount = rest.followerCount - Number(followed)
  return { ...rest, followed, followerCount }
}

interface LikeParam {
  likeCount: number
  likedBy: unknown[]
}

export const refineLike = <T extends LikeParam>(obj: T) => {
  const { likedBy, ...rest } = obj
  const liked = !!likedBy.length
  const likeCount = obj.likeCount - Number(liked)
  return { ...rest, liked, likeCount }
}

interface MessageParam {
  messages: unknown[]
}

export const refineChat = <T extends MessageParam>(obj: T) => {
  const { messages, ...rest } = obj
  const message = messages[0] ?? null
  return { ...rest, message }
}
