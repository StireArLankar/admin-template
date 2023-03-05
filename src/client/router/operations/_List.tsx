import { useSearch } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { tw } from 'typewind'
import { z } from 'zod'

import { listItemSchema } from './common'

import { OutlinedCell } from '@/components/OutlinedCell'
import { SearchableCell } from '@/components/SearchableCell'
import { StyledLink } from '@/components/StyledLink'
import { BaseTable } from '@/router/_BaseTable'
import { formatDate } from '@/utils/formatDate'
import { statusSchema } from '~common/typings'

type Item = z.infer<typeof listItemSchema>

type BoolMap = Partial<Record<keyof Item, boolean>>

const enableSortMap: BoolMap = {
	id: true,
	updatedAt: true,
}

const getEnableSorting = (key: keyof BoolMap) => enableSortMap[key] ?? false

const enableFilterMap: BoolMap = {
	id: true,
	userId: true,
	status: true,
}

const getEnableColumnFilter = (key: keyof BoolMap) =>
	enableFilterMap[key] ?? false

export default function List() {
	const search = useSearch({ from: '/layout/operations/' })

	if (!('pageIndex' in search)) {
		return null
	}

	return (
		<BaseTable
			search={search}
			columns={defaultColumns}
			kee='operations'
			path='/operations'
		/>
	)
}

const columnHelper = createColumnHelper<Item>()

const idColumn = columnHelper.accessor('id', {
	filterFn: () => true,
	cell: (info) => (
		<StyledLink canCopy to='/operations/$id' id={info.getValue()} />
	),
	header: () => <span style={{ whiteSpace: 'nowrap' }}>operationID</span>,
	enableSorting: getEnableSorting('id'),
	enableColumnFilter: getEnableColumnFilter('id'),
})

const updatedAtColumn = columnHelper.accessor('updatedAt', {
	header: 'updatedAt',
	cell: (info) => <OutlinedCell value={formatDate(info.getValue())} />,
	enableSorting: getEnableSorting('updatedAt'),
	enableColumnFilter: getEnableColumnFilter('updatedAt'),
})

const userIdColumn = columnHelper.accessor('userId', {
	header: 'userId',
	cell: (info) => (
		<SearchableCell
			value={info.getValue()}
			setFilterValue={(value) =>
				info.column.setFilterValue({ type: 'name', value })
			}
		/>
	),
	enableSorting: getEnableSorting('userId'),
	enableColumnFilter: getEnableColumnFilter('userId'),
})

const resultClassByValue: Record<NonNullable<Item['status']>, any> = {
	fail: tw.bg_red_400.bg_opacity_40,
	success: tw.bg_green_400.bg_opacity_40,
	processing: tw.bg_blue_400.bg_opacity_40,
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

const defaultColumns = [updatedAtColumn, idColumn, userIdColumn, statusColumn]
