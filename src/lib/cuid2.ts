import { init } from '@paralleldrive/cuid2'

const shortId = init({
  length: 12,
  fingerprint: `${process.env.CUID_FINGERPRINT}`
})

export default shortId
