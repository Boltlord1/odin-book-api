import { init } from '@paralleldrive/cuid2'

const createId = init({
	length: 12,
	fingerprint: `${process.env.CUID_FINGERPRINT}`
})

export default createId
