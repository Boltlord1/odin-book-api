import 'dotenv/config'
import express from 'express'

const app = express()

const port = process.env.PORT
app.listen(port, (err) => {
	if (err) {
		console.log(err)
		return
	}
	console.log(`Odin Book listening on port ${port}`)
})
