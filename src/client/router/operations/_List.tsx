import { useRef, useState } from 'react'

import * as Popover from '@radix-ui/react-popover'
import { useSearch } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { Reorder, useDragControls } from 'framer-motion'
import { HandIcon } from 'lucide-react'
import { tw } from 'typewind'
import { z } from 'zod'

import { listItemSchema } from './common'

import { OutlinedCell } from '@/components/OutlinedCell'
import { SearchableCell } from '@/components/SearchableCell'
import { StyledLink } from '@/components/StyledLink'
import { Button } from '@/components/ui/Button'
import { BaseTable } from '@/router/_BaseTable'
import { formatDate } from '@/utils/formatDate'
import { statusSchema } from '~common/typings'

function List123(props: { items: any[]; onSort: any }) {
	const ref = useRef<HTMLDivElement>(null)

	return (
		<Reorder.Group
			axis='y'
			onReorder={props.onSort}
			layoutScroll
			values={props.items}
			ref={ref}
			className={tw.flex.flex_col.gap_1}
		>
			{props.items.map((item) => (
				<Item123 key={item.id} value={item} constraints={ref}>
					{item}
				</Item123>
			))}
		</Reorder.Group>
	)
}

function Item123({ value, constraints }: any) {
	const controls = useDragControls()

	return (
		<Reorder.Item
			value={value}
			dragListener={false}
			dragControls={controls}
			whileDrag={{ zIndex: 10 }}
			className={
				tw.select_none.flex.items_center.justify_between.gap_2.bg_primary_600
					.rounded_md.p_1.border.border_primary_100
			}
			dragConstraints={constraints}
			dragElastic={{ top: 0, bottom: 0 }}
		>
			<span>{value.id}</span>
			<div className='reorder-handle' onPointerDown={(e) => controls.start(e)}>
				<HandIcon className={tw.w_4.h_4.cursor_pointer.fill_primary_600} />
			</div>
		</Reorder.Item>
	)
}

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

	const [columns, setColumns] = useState(defaultColumns)

	const [fixedColumns, setFixedColumns] = useState(defaultColumns)

	if (!('pageIndex' in search)) {
		return null
	}

	return (
		<BaseTable
			search={search}
			columns={fixedColumns}
			kee='operations'
			path='/operations'
		>
			<div className={tw.p_1}>
				<Popover.Root
					onOpenChange={(bool) => {
						if (!bool) {
							setFixedColumns(columns)
						}
					}}
				>
					<Popover.Trigger asChild>
						<Button
							variant='outline'
							className={tw.flex.items_center.whitespace_nowrap.justify_start}
						>
							Reorder
						</Button>
					</Popover.Trigger>

					<Popover.Content
						sideOffset={3}
						collisionPadding={8}
						side='bottom'
						align='start'
						className={
							tw.z_50.flex.flex_col.p_2.border.rounded_lg.bg_primary_800
								.border_primary_600
						}
					>
						<List123 items={columns} onSort={setColumns} />
					</Popover.Content>
				</Popover.Root>
			</div>
		</BaseTable>
	)
}

const columnHelper = createColumnHelper<Item>()

const idColumn = columnHelper.accessor('id', {
	id: 'id',
	filterFn: () => true,
	cell: (info) => (
		<StyledLink canCopy to='/operations/$id' id={info.getValue()} />
	),
	header: () => <span style={{ whiteSpace: 'nowrap' }}>operationID</span>,
	enableSorting: getEnableSorting('id'),
	enableColumnFilter: getEnableColumnFilter('id'),
})

const updatedAtColumn = columnHelper.accessor('updatedAt', {
	id: 'updatedAt',
	header: 'updatedAt',
	cell: (info) => {
		const value = info.getValue()

		return (
			<OutlinedCell
				value={formatDate(value)}
				tooltipValue={value?.toISOString?.()}
			/>
		)
	},
	enableSorting: getEnableSorting('updatedAt'),
	enableColumnFilter: getEnableColumnFilter('updatedAt'),
})

const userIdColumn = columnHelper.accessor('userId', {
	id: 'userId',
	header: 'userId',
	cell: (info) => (
		<SearchableCell
			value={info.getValue()}
			colorize={2}
			setFilterValue={(value) =>
				info.column.setFilterValue({ type: 'name', value })
			}
		/>
	),
	enableSorting: getEnableSorting('userId'),
	enableColumnFilter: getEnableColumnFilter('userId'),
})

const resultClassByValue: Record<NonNullable<Item['status']>, any> = {
	fail: tw.important(tw.bg_red_400$[40].border_red_400),
	success: tw.important(tw.bg_green_400$[40].border_green_400),
	processing: tw.important(tw.bg_blue_400$[40].border_blue_400),
}

const statusColumn = columnHelper.accessor('status', {
	id: 'status',
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
