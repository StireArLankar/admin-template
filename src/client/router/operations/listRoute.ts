import { Route } from '@tanstack/react-router'
import { ColumnFilter, ColumnSort } from '@tanstack/react-table'
import { z } from 'zod'

import Component from './_List'
import { listItemSchema } from './common'
import rootRoute from './rootRoute'

import { baseSearchSchema } from '@/utils/baseSearchSchema'
import { filterTypeValue } from '~common/typings'

const fieldsKeys = listItemSchema.keyof()

const sortZod = z.object({
	id: fieldsKeys,
	desc: z.boolean(),
}) satisfies z.ZodType<ColumnSort>

const filterZod = z.object({
	id: fieldsKeys,
	value: filterTypeValue,
}) satisfies z.ZodType<ColumnFilter>

const searchSchema = baseSearchSchema.extend({
	filters: filterZod.array().catch([]),
	sort: sortZod.array().catch([]),
})

export default new Route({
	getParentRoute: () => rootRoute,
	path: '/',
	validateSearch: (search) => searchSchema.parse(search),
	component: Component,
})
