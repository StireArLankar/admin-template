import { TRPCError } from '@trpc/server'
import * as z from 'zod'

import { filtersEnumToWhere, sortToSort } from './_helpers'

import { protectedProcedure, t } from '~/trpc/context'
import { SubOperationScalarFieldEnumSchema as fields } from '~common/generated/zod/inputTypeSchemas/SubOperationScalarFieldEnumSchema'
import { filtersSchema, listSchema } from '~common/typings'

const procedure = protectedProcedure

const total = procedure.input(filtersSchema).query(async ({ input, ctx }) => {
	const filters = filtersEnumToWhere(input, fields)

	const data = await ctx.prisma.subOperation.count({
		where: filters,
	})

	return data
})

const item = procedure.input(z.string()).query(async ({ input, ctx }) => {
	const item = await ctx.prisma.subOperation.findFirst({
		where: { id: input },
	})

	if (!item) {
		throw new TRPCError({ code: 'NOT_FOUND' })
	}

	return item
})

const list = procedure.input(listSchema).query(async ({ input, ctx }) => {
	const { pageSize, pageIndex, sort } = input

	const filters = filtersEnumToWhere(input.filters, fields)

	const data = await ctx.prisma.subOperation.findMany({
		where: filters,
		take: pageSize,
		skip: pageSize * pageIndex,

		orderBy: sortToSort(sort, fields),
	})

	return data
})

export const subOperationsRouter = t.router({ total, list, item })
