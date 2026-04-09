import 'dotenv/config'
import express, { urlencoded } from 'express'
import passport from 'passport'
import { default as authRouter } from './routers/auth'
import { default as postRouter } from './routers/post'

const app = express()
app.use(passport.initialize())

app.use(urlencoded({ extended: true }))

app.use('/', authRouter)
app.use('/post', postRouter)

const port = process.env.PORT ?? '3000'
app.listen(port, (err) => {
	if (err) {
		console.log(err)
		return
	}
	console.log(`Odin Book listening on port ${port}`)
})
