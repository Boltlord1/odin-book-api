import { issueJwt, issueTempJwt } from '../dist/src/lib/issueJwt.js'

const token = issueJwt('6e7bc162-e5a6-4d2c-985a-f39d4fa345e7')
const temp = issueTempJwt('string', 'github')

console.log('Main token:')
console.log(token)

console.log('Temp token:')
console.log(temp)
