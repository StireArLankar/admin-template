import { z } from 'zod'

export type AdminConfig = z.infer<typeof adminConfigSchema>

const adminConfigSchema = z
	.object({
		login: z.string().describe('login'),
		password: z.string().describe('password'),
		role: z.enum(['admin', 'user']).default('user').describe('role'),
	})
	.array()
	.describe('users')

export const devopsConfigSchema = z.object({
	service: z
		.object({
			name: z.string().describe('App name'),
			environment: z.string().describe('Environment'),
			hostUrl: z.string().describe('Base path'),
		})
		.describe('Base config for service'),

	ports: z
		.object({
			application: z.union([z.string(), z.number()]).describe('Main port'),
			management: z.union([z.string(), z.number()]).describe('Manage port'),
		})
		.describe('Ports config'),

	users: adminConfigSchema,

	client: z.object({
		hello: z.literal('world'),
	}),
})

export type DevopsConfig = z.infer<typeof devopsConfigSchema>

declare global {
	type GlobalState = DevopsConfig['client']
}
