import { Prisma } from '@prisma/client'
import * as z from 'zod'

import { filtersSchema, listSchema } from '~common/typings'

type zxc =
	| Prisma.OperationWhereInput
	| Prisma.UserWhereInput
	| Prisma.SubOperationWhereInput
	| Prisma.SubOperation2WhereInput

type zxc1 =
	| Prisma.OperationOrderByWithRelationInput
	| Prisma.UserOrderByWithRelationInput
	| Prisma.SubOperationOrderByWithRelationInput
	| Prisma.SubOperation2OrderByWithRelationInput

export const filtersEnumToWhere = <T extends zxc>(
	input: z.infer<typeof filtersSchema>,
	fields: z.ZodEnum<[string, ...string[]]>
): T => {
	const filters = input.reduce((acc, cur) => {
		const kee = fields.safeParse(cur.id)

		if (!kee.success) {
			return acc
		}

		switch (cur.value.type) {
			case 'enum':
				;(acc as any)[kee.data] = { equals: cur.value.value }
				break
			case 'name':
				;(acc as any)[kee.data] = { startsWith: cur.value.value }
				break
			case 'equal':
				;(acc as any)[kee.data] = { equals: cur.value.value }
				break
		}

		return acc
	}, {} as T)

	return filters
}

export const sortToSort = <T extends zxc1>(
	input: z.infer<typeof listSchema>['sort'],
	fields: z.ZodEnum<[string, ...string[]]>
): T => {
	if (input.length === 0) {
		return { updatedAt: 'desc' } as T
	}

	const sorting = input.reduce((acc, cur) => {
		const kee = fields.safeParse(cur.id)

		if (!kee.success) {
			return acc
		}

		;(acc as any)[cur.id] = cur.desc ? 'desc' : 'asc'
		return acc
	}, {} as T)

	return sorting
}
