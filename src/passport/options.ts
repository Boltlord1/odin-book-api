import type { AuthenticateOptions } from 'passport'

const standardOptions: AuthenticateOptions = {
	session: false
}

const callbackOptions: AuthenticateOptions = {
	...standardOptions,
	assignProperty: 'case'
}

export { standardOptions }
