import type { Image, User } from '../../generated/prisma/client'

interface PostData {
	id: string
	title: string
	content: string | null
	createdAt: Date
	images: Image[]
	author: User
	comments: number
	likes: number
	liked: boolean
}

interface CommentData {
	id: string
	content: string
	createdAt: Date
	author: User
	likes: number
	liked: boolean
}

export type { CommentData, PostData }
