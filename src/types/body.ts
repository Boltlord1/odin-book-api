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
  display: string
  username: string
}

interface UpdateData {
  display?: string
  name?: string
}

interface PostData {
  content: string
  title: string
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
