import type { EmailData, GithubData, GoogleData } from './request'

declare global {
	namespace PrismaJson {
		type IdentityDataType = EmailData | GithubData | GoogleData
	}
}
