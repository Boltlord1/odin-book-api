import type { CommentData, PostData } from '../types/data'
import type {
	CommentWithUserAndLikes,
	PostWithUserImagesAndLikes,
	UserWithIdentities
} from '../types/prisma'

function refinePost(raw: PostWithUserImagesAndLikes) {
	const refined: PostData = {
		...raw,
		comments: raw._count.comments,
		likes: raw._count.likedBy,
		liked: raw.likedBy.length > 0
	}

	return refined
}

function refineComment(raw: CommentWithUserAndLikes) {
	const refined: CommentData = {
		...raw,
		likes: raw._count.likedBy,
		liked: raw.likedBy.length > 0
	}

	return refined
}

function refineSelf(raw: UserWithIdentities) {
	const refined: UserWithIdentities = {
		...raw
	}

	for (const identity of refined.identities) {
		if (identity.provider === 'Email') {
			const data = identity.data
			delete data.hash
		}
	}

	return refined
}

export { refineComment, refinePost, refineSelf }
