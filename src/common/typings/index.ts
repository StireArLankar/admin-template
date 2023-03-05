import { z } from 'zod'

const filterTypes = z.enum(['enum', 'name', 'equal'])

const filterTypeToFilterValue = {
	enum: z.object({ type: z.literal('enum'), value: z.string() }),
	name: z.object({ type: z.literal('name'), value: z.string() }),
	equal: z.object({ type: z.literal('equal'), value: z.string() }),
} satisfies Record<z.infer<typeof filterTypes>, z.ZodType>

const filterTypeToMeta = {
	enum: z.object({
		type: z.literal('enum'),
		width: z.number().optional(),
		items: z
			.object({
				value: z.string(),
				label: z.string(),
			})
			.array(),
	}),
	name: z.object({ type: z.literal('name'), width: z.number().optional() }),
	equal: z.object({ type: z.literal('equal'), width: z.number().optional() }),
} satisfies Record<z.infer<typeof filterTypes>, z.ZodType>

export type FilterTypeToMeta = {
	[K in keyof typeof filterTypeToMeta]: z.infer<(typeof filterTypeToMeta)[K]>
}[keyof typeof filterTypeToMeta]

export const includes = (value: string, array: string[]) =>
	array.includes(value)

export const filterTypeValue = z.discriminatedUnion('type', [
	filterTypeToFilterValue.enum,
	filterTypeToFilterValue.name,
	filterTypeToFilterValue.equal,
])

const filterZod = z.object({
	id: z.string(),
	value: filterTypeValue,
})

const sortZod = z.object({
	id: z.string(),
	desc: z.boolean(),
})

export const listSchema = z.object({
	pageIndex: z.number().default(0),
	pageSize: z.number().default(100),
	sort: sortZod.array().catch([]),
	filters: filterZod.array().catch([]),
})

export const filtersSchema = filterZod.array().catch([])

export const finalStatusSchema = z.enum(['fail', 'success', 'processing'])

export const operationListItemSchema = z.object({
	updatedAt: z.coerce.date().transform((v) => v.toISOString()),
	// updatedAt: z.string(),
	id: z.string(),
	login: z.string().nullish(),
	step: z.string(),
	project: z.string().nullish(),
	userId: z.string().nullish(),
	error: z.string().nullish(),
	guid: z.string().nullish(),
	finalStatus: finalStatusSchema,
	referenceId: z.string(),
	scenario: z.string().nullish(),
})

export const depositOperationListItemSchema = z.object({
	updatedAt: z.coerce.date().transform((v) => v.toISOString()),
	createdAt: z.coerce.date().transform((v) => v.toISOString()),
	transactionId: z.string().nullish(),
	depositId: z.string(),
	type: z.enum(['crypto', 'noCrypto']),
	project: z.string().nullish(),
})

export const callbackListItemSchema = z.object({
	updatedAt: z.coerce.date().transform((v) => v.toISOString()),
	createdAt: z.coerce.date().transform((v) => v.toISOString()),
	id: z.string(),
	transactionId: z.string(),
	projectId: z.string(),
})

export const pusherCallbackItemSchema = z.object({
	updatedAt: z.coerce.date().transform((v) => v.toISOString()),
	createdAt: z.coerce.date().transform((v) => v.toISOString()),
	id: z.string(),
	projectId: z.string(),
	result: z.enum(['success', 'failure']),
})

export const verificationItemSchema = z.object({
	updatedAt: z.coerce.date().transform((v) => v.toISOString()),
	createdAt: z.coerce.date().transform((v) => v.toISOString()),
	verificationDate: z.coerce
		.date()
		.transform((v) => v.toISOString())
		.optional(),
	login: z.string(),
})

export const statusSchema = z.enum(['fail', 'success', 'processing'])
