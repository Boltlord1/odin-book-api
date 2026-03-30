import bcrypt from 'bcrypt'
import prisma from '../dist/src/lib/primsa.js'

const password = process.env.PASSWORD
const hash = await bcrypt.hash(password, 10)

const user = prisma.user.create({
	data: {
		name: 'boltlord',
		display: 'Boltlord',
		avatar: 'default',
		hash
	}
})

try {
	await prisma.$transaction([user])
	console.log('Created user.')
	process.exit(1)
} catch (error) {
	console.error(error)
}
