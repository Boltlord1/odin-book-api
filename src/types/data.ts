interface EmailData {
	hash: string
	verified: boolean
}

interface GithubData {
	username: string
	url: string
}

interface GoogleData {
	email: string
}

type OauthData = GithubData | GoogleData

export type { EmailData, GithubData, GoogleData, OauthData }
