import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { urlencoded } from 'express'
import passport from './passport/passport'
import { default as authRouter } from './routers/auth'
import { default as followRouter } from './routers/follow'
import { default as likeRouter } from './routers/like'
import { default as postRouter } from './routers/post'
import { default as userRouter } from './routers/user'

const app = express()

app.use(cookieParser())
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(passport.initialize())

app.use('/auth', authRouter)
app.use('/post', postRouter)
app.use('/user', userRouter)
app.use('/like', likeRouter)
app.use('/follow', followRouter)

const port = process.env.PORT ?? '3000'
app.listen(port, (err) => {
	if (err) {
		console.log(err)
		return
	}
	console.log(`Odin Book listening on port ${port}`)
})
