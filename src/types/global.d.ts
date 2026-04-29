import type { EmailData, GithubData, GoogleData } from './interfaces'

declare global {
	namespace PrismaJson {
		type IdentityDataType = EmailData | GithubData | GoogleData
	}
}
