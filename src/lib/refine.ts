import type {
  CommentData,
  PostData,
  ProfileData,
  ReplyData,
  SelfData
} from '../types/data'
import type {
  RawComment,
  RawPost,
  RawProfile,
  RawReply,
  RawSelf
} from '../types/prisma'

function refinePost(raw: RawPost) {
  const refined: PostData = {
    ...raw,
    comments: raw._count.comments,
    likes: raw._count.likedBy,
    liked: raw.likedBy.length > 0
  }

  return refined
}

function refineComment(raw: RawComment) {
  const refined: CommentData = {
    ...raw,
    likes: raw._count.likedBy,
    liked: raw.likedBy.length > 0,
    replies: raw.replies.map(refineReply)
  }

  return refined
}

function refineReply(raw: RawReply) {
  const refined: ReplyData = {
    ...raw,
    likes: raw._count.likedBy,
    liked: raw.likedBy.length > 0
  }

  return refined
}

function refineSelf(raw: RawSelf) {
  const refined: SelfData = {
    ...raw,
    posts: raw._count.posts,
    followers: raw._count.followers,
    follows: raw._count.follows
  }

  for (const identity of refined.identities) {
    if (identity.provider === 'Email') {
      const data = identity.data
      data.hash = undefined
    }
  }

  return refined
}

function refineUser(raw: RawProfile) {
  const refined: ProfileData = {
    ...raw,
    posts: raw._count.posts,
    followers: raw._count.followers,
    follows: raw._count.follows,
    followed: raw.followers.length > 0
  }

  return refined
}

export { refineComment, refinePost, refineReply, refineSelf, refineUser }
