interface EmailIdentity {
  verified: boolean
}

interface GithubIdentity {
  display: string
  url: string
  username: string
}

interface GoogleIdentity {
  display: string
  email: string
}

type OauthIdentity = GithubIdentity | GoogleIdentity

export type { EmailIdentity, GithubIdentity, GoogleIdentity, OauthIdentity }

declare global {
  // biome-ignore lint/style/noNamespace: none
  namespace PrismaJson {
    // Define a type for a user's profile information.
    type IdentityDataType = EmailIdentity | OauthIdentity
  }
}
