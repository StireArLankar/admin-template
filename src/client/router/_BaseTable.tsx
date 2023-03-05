import { useMemo, useRef } from 'react'

import { RegisteredRoutesInfo, useNavigate } from '@tanstack/react-router'
import {
	ColumnDef,
	ColumnFiltersState,
	getCoreRowModel,
	getSortedRowModel,
	PaginationState,
	SortingState,
	useReactTable,
} from '@tanstack/react-table'
import { tw } from 'typewind'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'

import TableComponent from '@/components/Table'
import { entityRoutesKeys, trpc } from '@/utils/trpc'
import { listSchema } from '~common/typings'

export const BaseTable = (props: {
	search: z.infer<typeof listSchema>
	kee: entityRoutesKeys
	path: RegisteredRoutesInfo['routePaths']
	columns: ColumnDef<any, any>[]
}) => {
	const { search, kee, path, columns } = props
	const { pageIndex, pageSize, sort, filters } = search
	const navigate = useNavigate({ from: '/' })

	const [debounced] = useDebounce(search, 300)

	//@ts-ignore
	const { data } = trpc.admin[kee].list.useQuery(debounced)
	//@ts-ignore
	const { data: total } = trpc.admin[kee].total.useQuery(debounced.filters)

	const dataRef = useRef(data ?? [])

	if (data) {
		dataRef.current = data
	}

	const pageCount = useMemo(() => {
		return total ? Math.ceil(total / pageSize) : pageIndex + 1
	}, [pageSize, total, pageIndex])

	const instance = useReactTable({
		data: dataRef.current,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),

		pageCount: pageCount,
		state: {
			pagination: { pageIndex, pageSize },
			sorting: sort,
			columnFilters: filters,
		},
		onColumnFiltersChange: (updater) => {
			let _filters: ColumnFiltersState

			if (typeof updater === 'function') {
				_filters = updater(filters)
			} else {
				_filters = updater
			}

			//@ts-ignore
			navigate({
				to: path,
				//@ts-ignore
				search: { ...search, pageIndex: 0, filters: _filters },
			})
		},
		onPaginationChange: (updater) => {
			let _pagination: PaginationState

			if (typeof updater === 'function') {
				_pagination = updater({ pageIndex, pageSize })
			} else {
				_pagination = updater
			}

			if (_pagination.pageSize !== pageSize) {
				_pagination.pageIndex = 0
			}

			//@ts-ignore
			navigate({
				to: path,
				//@ts-ignore
				search: {
					...search,
					pageIndex: _pagination.pageIndex,
					pageSize: _pagination.pageSize,
				},
			})
		},
		onSortingChange: (updater) => {
			let _sorting: SortingState

			if (typeof updater === 'function') {
				_sorting = updater(sort)
			} else {
				_sorting = updater
			}

			//@ts-ignore
			navigate({
				to: path,
				//@ts-ignore
				search: { ...search, pageIndex: 0, sort: _sorting as any },
			})
		},
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
		enableSorting: true,
		enableMultiSort: true,
	})

	return (
		<div className={tw.flex_1.flex.flex_col}>
			<TableComponent instance={instance} />
		</div>
	)
}
