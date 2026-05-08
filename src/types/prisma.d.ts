import type { EmailIdentity, GithubIdentity, GoogleIdentity } from './prisma'

declare global {
  // biome-ignore lint/style/noNamespace: none
  namespace PrismaJson {
    type IdentityDataType = EmailIdentity | GithubIdentity | GoogleIdentity
  }
}
