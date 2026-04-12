import 'dotenv/config'
import cors from 'cors'
import express, { urlencoded } from 'express'
import passport from './passport/passport'
import { default as authRouter } from './routers/auth'
import { default as postRouter } from './routers/post'
import { default as userRouter } from './routers/user'

const app = express()

app.use(cors())
app.use(urlencoded({ extended: true }))
app.use(passport.initialize())

app.use('/auth', authRouter)
app.use('/post', postRouter)
app.use('/user', userRouter)

const port = process.env.PORT ?? '3000'
app.listen(port, (err) => {
	if (err) {
		console.log(err)
		return
	}
	console.log(`Odin Book listening on port ${port}`)
})
