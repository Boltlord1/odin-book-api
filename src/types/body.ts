interface LogInData {
	username: string
	password: string
}

interface RegisterData {
	username: string
	display: string
	email: string
	password: string
}

interface OauthData {
	username: string
	display: string
}

interface UpdateBody {
	username: string
	display: string
}

interface UpdateData {
	name?: string
	display?: string
}

interface PostData {
	title: string
	content: string
}

interface CommentData {
	content: string
}

interface EmailData {
	email: string
	password: string
}

export type {
	CommentData,
	EmailData,
	LogInData,
	OauthData,
	PostData,
	RegisterData,
	UpdateBody,
	UpdateData
}
