import type { EmailIdentity, GithubIdentity, GoogleIdentity } from './prisma'

declare global {
  namespace PrismaJson {
    type IdentityDataType = EmailIdentity | GithubIdentity | GoogleIdentity
  }
}
