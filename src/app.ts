import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { validateInitial } from './controllers/validate'
import { frontendUrl } from './lib/variables'
import passport from './passport/passport'
import authRouter from './routers/auth'
import commentRouter from './routers/comment'
import likeRouter from './routers/like'
import postRouter from './routers/post'
import replyRouter from './routers/reply'
import userRouter from './routers/user'

const app = express()

app.use(cookieParser())
app.use(
  cors({
    origin: `${frontendUrl}`,
    credentials: true
  })
)
app.use(express.json())
app.use(passport.initialize())
app.use(validateInitial)

app.use('/auth', authRouter)
app.use('/comment', commentRouter)
app.use('/like', likeRouter)
app.use('/post', postRouter)
app.use('/reply', replyRouter)
app.use('/user', userRouter)

const port = process.env.PORT ?? '3000'
app.listen(port, err => {
  if (err) {
    console.log(err)
    return
  }
  console.log(`Odin Book listening on port ${port}`)
})
