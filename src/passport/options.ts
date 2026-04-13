import type { AuthenticateOptions } from 'passport'

const standardOptions: AuthenticateOptions = {
	session: false
}

const callbackOptions: AuthenticateOptions = {
	session: false,
	assignProperty: 'identity'
}

const registerOptions: AuthenticateOptions = {
	session: false,
	assignProperty: 'payload'
}

export { callbackOptions, registerOptions, standardOptions }
