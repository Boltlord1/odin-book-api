import { issueJwt, issueTempJwt } from '../dist/src/lib/issueJwt.js'

const token = issueJwt('string')
const temp = issueTempJwt('string', 'github')

console.log('Main token:')
console.log(token)

console.log('Temp token:')
console.log(temp)
