import { generateKeyPair } from 'node:crypto'
import fs from 'node:fs'

generateKeyPair(
  'rsa',
  {
    modulusLength: 4096,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  },
  (err, publicKey, privateKey) => {
    if (err) {
      console.log(err)
      return
    }

    const path = `${import.meta.dirname.slice(0, -7)}generated/`
    fs.writeFileSync(`${path}public.pem`, publicKey)
    fs.writeFileSync(`${path}private.pem`, privateKey)
  }
)
