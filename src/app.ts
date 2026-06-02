import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { errorHandler } from './controllers/error'
import { validateInitial } from './controllers/validate'
import { FRONTEND_URL } from './lib/variables'
import passport from './passport/passport'
import router from './routers/index'

const app = express()

app.use(cookieParser())
app.use(cors({ origin: `${FRONTEND_URL}`, credentials: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(validateInitial)

app.use('/', router)
app.use(errorHandler)

const port = process.env.PORT ?? '3000'
app.listen(port, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log(`Odin Book listening on port ${port}`)
})
