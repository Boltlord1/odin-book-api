interface EmailIdentity {
  verified: boolean
}

interface GithubIdentity {
  avatar: string
  display: string
  url: string
  username: string
}

interface GoogleIdentity {
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
