interface LogInData {
  password: string
  username: string
}

interface RegisterData {
  display: string
  email: string
  password: string
  username: string
}

interface OauthData {
  display: string
  username: string
}

interface UpdateBody {
  display: string | undefined
  username: string | undefined
}

interface UpdateData {
  display?: string
  name?: string
}

interface PostData {
  content: string
  title: string
}

interface ContentData {
  content: string
}

interface EmailData {
  email: string
  password: string
}

export type {
  ContentData,
  EmailData,
  LogInData,
  OauthData,
  PostData,
  RegisterData,
  UpdateBody,
  UpdateData
}
