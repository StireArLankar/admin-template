import { TRPCError } from '@trpc/server'
import * as z from 'zod'

import { filtersEnumToWhere, sortToSort } from './_helpers'

import { protectedProcedure, t } from '~/trpc/context'
import { OperationScalarFieldEnumSchema } from '~common/generated/zod/inputTypeSchemas/OperationScalarFieldEnumSchema'
import { filtersSchema, listSchema } from '~common/typings'

const procedure = protectedProcedure

const total = procedure.input(filtersSchema).query(async ({ input, ctx }) => {
	const filters = filtersEnumToWhere(input, OperationScalarFieldEnumSchema)

	const data = await ctx.prisma.operation.count({
		where: filters,
	})

	return data
})

const item = procedure.input(z.string()).query(async ({ input, ctx }) => {
	const item = await ctx.prisma.operation.findFirst({
		where: { id: input },
		include: { subOperation: true, subOperation2: true },
	})

	if (!item) {
		throw new TRPCError({ code: 'NOT_FOUND' })
	}

	return item
})

const list = procedure.input(listSchema).query(async ({ input, ctx }) => {
	const { pageSize, pageIndex, sort } = input

	const filters = filtersEnumToWhere(
		input.filters,
		OperationScalarFieldEnumSchema
	)

	const data = await ctx.prisma.operation.findMany({
		where: filters,
		take: pageSize,
		skip: pageSize * pageIndex,

		orderBy: sortToSort(sort, OperationScalarFieldEnumSchema),
	})

	return data
})

export const operationsRouter = t.router({ total, list, item })
