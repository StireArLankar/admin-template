import { devopsConfigSchema } from './devops.zod'

export const tryToValidate = (config: any) => {
	const result = devopsConfigSchema.safeParse(config)

	if (result.success) {
		return result.data
	}

	console.error(
		JSON.stringify({
			app: config.service.name ?? '_',
			product: config.product ?? '_',
			environment: config.service.environment ?? '_',
			version: process.env.VERSION,
			level: 0,
			logLevel: 'fatal',
			message: 'config doesnt match schema!',
			exception: JSON.stringify(result.error.issues),
			timestamp: Date.now() / 1000,
		})
	)

	throw new Error('config doesnt match schema!')
}
