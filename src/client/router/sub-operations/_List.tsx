import { useSearch } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { tw } from 'typewind'
import { z } from 'zod'

import { listItemSchema } from './common'

import { OutlinedCell } from '@/components/OutlinedCell'
import { StyledLink } from '@/components/StyledLink'
import { BaseTable } from '@/router/_BaseTable'
import { formatDate } from '@/utils/formatDate'
import { statusSchema } from '~common/typings'

type Item = z.infer<typeof listItemSchema>

type BoolMap = Partial<Record<keyof Item, boolean>>

const enableSortMap: BoolMap = {
	updatedAt: true,
	createdAt: true,
}

const getEnableSorting = (key: keyof BoolMap) => enableSortMap[key] ?? false

const enableFilterMap: BoolMap = {
	status: true,
	id: true,
}

const getEnableColumnFilter = (key: keyof BoolMap) =>
	enableFilterMap[key] ?? false

export default function List() {
	const search = useSearch({ from: '/layout/sub-operations/' })

	if (!('pageIndex' in search)) {
		return null
	}

	return (
		<BaseTable
			search={search}
			columns={defaultColumns}
			kee='sub'
			path='/sub-operations'
		/>
	)
}

const columnHelper = createColumnHelper<Item>()

const updatedAtColumn = columnHelper.accessor('updatedAt', {
	header: 'updatedAt',
	cell: (info) => <OutlinedCell value={formatDate(info.getValue())} />,
	enableSorting: getEnableSorting('updatedAt'),
	enableColumnFilter: getEnableColumnFilter('updatedAt'),
})

const createdAtColumn = columnHelper.accessor('createdAt', {
	header: 'createdAt',
	cell: (info) => <OutlinedCell value={formatDate(info.getValue())} />,
	enableSorting: getEnableSorting('createdAt'),
	enableColumnFilter: getEnableColumnFilter('createdAt'),
})

const transactionIdColumn = columnHelper.accessor('id', {
	cell: (info) => <StyledLink to='/operations/$id' id={info.getValue()} />,
	header: () => <span style={{ whiteSpace: 'nowrap' }}>operationID</span>,
	enableSorting: getEnableSorting('id'),
	enableColumnFilter: getEnableColumnFilter('id'),
})

const depositIdColumn = columnHelper.accessor('id', {
	cell: (info) => <StyledLink to='/sub-operations/$id' id={info.getValue()} />,
	id: `213`,
	header: () => <span style={{ whiteSpace: 'nowrap' }}>subOperationId</span>,
	enableSorting: false,
	enableColumnFilter: false,
	// enableSorting: getEnableSorting('id'),
	// enableColumnFilter: getEnableColumnFilter('id'),
})

const resultClassByValue: Record<NonNullable<Item['status']>, any> = {
	fail: tw.important(tw.bg_red_400$[40].border_red_400),
	success: tw.important(tw.bg_green_400$[40].border_green_400),
	processing: tw.important(tw.bg_blue_400$[40].border_blue_400),
}

const statusColumn = columnHelper.accessor('status', {
	header: 'status',
	enableSorting: getEnableSorting('status'),
	enableColumnFilter: getEnableColumnFilter('status'),
	cell: (info) => (
		<OutlinedCell classByValue={resultClassByValue} value={info.getValue()} />
	),

	meta: {
		filter: {
			type: 'enum',
			items: [...statusSchema.options, ''].map((value) => ({
				value,
				label: value || 'none',
			})),
		},
	},
})

const defaultColumns = [
	createdAtColumn,
	updatedAtColumn,
	transactionIdColumn,
	depositIdColumn,
	statusColumn,
]
