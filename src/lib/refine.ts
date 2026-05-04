import type {
  CommentData,
  PostData,
  ProfileData,
  SelfData
} from '../types/data'
import type {
  CommentWithUserAndCounts,
  PostWithUserImagesAndCounts,
  UserWithCounts,
  UserWithIdentitiesAndCounts
} from '../types/prisma'

function refinePost(raw: PostWithUserImagesAndCounts) {
  const refined: PostData = {
    ...raw,
    comments: raw._count.comments,
    likes: raw._count.likedBy,
    liked: raw.likedBy.length > 0
  }

  return refined
}

function refineComment(raw: CommentWithUserAndCounts) {
  const refined: CommentData = {
    ...raw,
    likes: raw._count.likedBy,
    liked: raw.likedBy.length > 0
  }

  return refined
}

function refineSelf(raw: UserWithIdentitiesAndCounts) {
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

function refineUser(raw: UserWithCounts) {
  const refined: ProfileData = {
    ...raw,
    posts: raw._count.posts,
    followers: raw._count.followers,
    follows: raw._count.follows,
    followed: raw.followers.length > 0
  }

  return refined
}

export { refineComment, refinePost, refineSelf, refineUser }
