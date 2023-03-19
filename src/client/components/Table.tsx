import { useEffect, useRef, useState } from 'react'

import { SortDirection, Table, flexRender, Column } from '@tanstack/react-table'
import {
	X,
	ChevronsRight,
	ChevronRight,
	ChevronLeft,
	ChevronsLeft,
} from 'lucide-react'
import store from 'store2'
import { tw } from 'typewind'

import { Button, buttonVariants } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ScrollArea } from '@/components/ui/ScrollArea'
import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
	SelectItem,
} from '@/components/ui/Select'
import { checkNever } from '~common/utils/checkNever'

const sortDirToIcon = (dir: false | SortDirection) => {
	switch (dir) {
		case false:
			return null

		case 'asc':
			return ' 🔼'

		case 'desc':
			return ' 🔽'

		default:
			;((_: never) => {})(dir)
			return null
	}
}

export default function Table1<T>({ instance }: { instance: Table<T> }) {
	const renderHeaders = () =>
		instance.getHeaderGroups().map((headerGroup) => (
			<tr key={headerGroup.id}>
				{headerGroup.headers.map((header) => (
					<th
						key={header.id}
						colSpan={header.colSpan}
						style={{
							width: header.getSize() === 150 ? undefined : header.getSize(),
						}}
						className={tw.px_[0.5].align_baseline.text_center.border_b_2.border_primary_600
							.last_of_type(tw.pr_2)
							.variant('&:not(:last-child)', tw.border_r_2)}
					>
						{header.isPlaceholder ? (
							<div>
								<span
									style={{
										color: 'transparent',
									}}
								>
									a
								</span>
							</div>
						) : (
							<div>
								<div
									{...{
										style: header.column.getCanSort()
											? {
													cursor: 'pointer',
													userSelect: 'none',
											  }
											: undefined,
										onClick: header.column.getToggleSortingHandler(),
									}}
								>
									{flexRender(
										header.column.columnDef.header,
										header.getContext()
									)}
									{sortDirToIcon(header.column.getIsSorted())}
								</div>
								{header.column.getCanFilter() ? (
									<div className={tw.p_1.pb_2}>
										<Filter column={header.column} table={instance} />
									</div>
								) : null}
							</div>
						)}
					</th>
				))}
			</tr>
		))

	const renderBody = () =>
		instance.getRowModel().rows.map((row) => (
			<tr key={row.id}>
				{row.getVisibleCells().map((cell) => (
					<td
						className={tw.p_[0.5].border_b_2.border_primary_600
							.last_of_type(tw.pr_2)
							.variant('&:not(:last-child)', tw.border_r_2)}
						key={cell.id}
					>
						{flexRender(cell.column.columnDef.cell, cell.getContext())}
					</td>
				))}
			</tr>
		))

	const ref = useRef<HTMLDivElement & { scrollTopTop: () => {} }>(null)

	const ops = instance.getState().pagination.pageIndex

	useEffect(() => {
		ref.current?.scrollTopTop()
	}, [ops])

	const renderTable = () => (
		<ScrollArea
			ref={ref}
			style={{
				display: 'block',
				maxWidth: '100%',
				flexGrow: 1,
				flexBasis: 0,
				minHeight: 0,
			}}
		>
			<div className={tw.max_w_full}>
				<table
					className={tw.table_auto.border_spacing_0.border_separate.w_full}
				>
					<thead className={tw.sticky.top_0.bg_primary_900.z_10}>
						{renderHeaders()}
					</thead>
					<tbody>{renderBody()}</tbody>
				</table>
			</div>
		</ScrollArea>
	)

	return (
		<div className={tw.flex_1.flex.flex_col}>
			{renderTable()}

			<ScrollArea>
				<div
					className={
						tw.flex.items_center.p_2.space_x_2.border_t_primary_400.border_t
					}
				>
					<button
						className={buttonVariants({ variant: 'outline' })}
						onClick={() => instance.setPageIndex(0)}
						disabled={!instance.getCanPreviousPage()}
					>
						<ChevronsLeft className={tw.w_6.h_6} />
					</button>
					<button
						className={buttonVariants({ variant: 'outline' })}
						onClick={() => instance.previousPage()}
						disabled={!instance.getCanPreviousPage()}
					>
						<ChevronLeft className={tw.w_6.h_6} />
					</button>
					<button
						className={buttonVariants({ variant: 'outline' })}
						onClick={() => instance.nextPage()}
						disabled={!instance.getCanNextPage()}
					>
						<ChevronRight className={tw.w_6.h_6} />
					</button>
					<button
						className={buttonVariants({ variant: 'outline' })}
						onClick={() => instance.setPageIndex(instance.getPageCount() - 1)}
						disabled={!instance.getCanNextPage()}
					>
						<ChevronsRight className={tw.w_6.h_6} />
					</button>
					<span
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 4,
							whiteSpace: 'nowrap',
						}}
					>
						<div>Page</div>
						<strong>
							{instance.getState().pagination.pageIndex + 1} of{' '}
							{instance.getPageCount()}
						</strong>
					</span>
					<div className={tw.px_2}>
						<Select
							value={instance.getState().pagination.pageSize.toString()}
							onValueChange={(val) => {
								store.set('pageSize', Number(val))
								instance.setPageSize(Number(val))
							}}
						>
							<SelectTrigger className='w-[110px]'>
								<SelectValue placeholder='Theme' />
							</SelectTrigger>
							<SelectContent>
								{[10, 20, 30, 40, 50, 100, 200].map((pageSize) => (
									<SelectItem key={pageSize} value={pageSize.toString()}>
										Show {pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</ScrollArea>
		</div>
	)
}

type FilterProps<TData> = {
	column: Column<TData, unknown>
	table: Table<TData>
}

function Filter<TData>({ column }: FilterProps<TData>) {
	const columnFilterValue: any = column.getFilterValue()

	const zxc = column.columnDef.meta?.filter

	switch (zxc?.type) {
		case 'enum':
			return (
				<div className='flex w-full items-center space-x-2'>
					<Select
						value={columnFilterValue?.value ?? ''}
						onValueChange={(value) =>
							column.setFilterValue(value ? { type: 'enum', value } : undefined)
						}
					>
						<SelectTrigger
							className={tw.px_2.justify_center}
							style={{ minWidth: zxc.width || 'max-content' }}
							hideArrow
						>
							<SelectValue placeholder='Theme' />
						</SelectTrigger>
						<SelectContent>
							{zxc.items.map((item) => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			)

		case 'equal':
			return (
				<DebouncedInput
					type='text'
					id={column.id}
					style={{ minWidth: zxc?.width }}
					value={columnFilterValue?.value ?? ''}
					onChange={(value) => {
						return column.setFilterValue(
							value ? { type: 'equal', value } : undefined
						)
					}}
				/>
			)

		case 'name':
		case undefined:
			return (
				<DebouncedInput
					type='text'
					id={column.id}
					style={{ minWidth: zxc?.width }}
					value={columnFilterValue?.value ?? ''}
					onChange={(value) => {
						return column.setFilterValue(
							value ? { type: 'name', value } : undefined
						)
					}}
				/>
			)

		default:
			checkNever(zxc)
			return (
				<DebouncedInput
					type='text'
					id={column.id}
					value={columnFilterValue?.value ?? ''}
					onChange={(value) => {
						return column.setFilterValue(
							value ? { type: 'name', value } : undefined
						)
					}}
				/>
			)
	}
}

// A debounced input react component
function DebouncedInput({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}: {
	value: string | number
	onChange: (value: string | number) => void
	debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
	const [value, setValue] = useState(initialValue)

	useEffect(() => {
		setValue(initialValue)
	}, [initialValue])

	const onChangeRef = useRef(onChange)
	onChangeRef.current = onChange

	const isMounted = useRef(false)

	useEffect(() => {
		if (!isMounted.current) {
			isMounted.current = true
			return
		}

		const timeout = setTimeout(() => {
			onChangeRef.current(value)
		}, debounce)

		return () => clearTimeout(timeout)
	}, [value, debounce])

	return (
		<div className='flex w-full items-center space-x-2'>
			<Input
				{...props}
				value={value}
				className={tw.min_w_['12ch'].font_medium.flex_1.text_center}
				onChange={(e) => setValue(e.target.value)}
			/>
			<Button
				type='button'
				variant='outline'
				className={tw.px_2}
				onClick={() => setValue('')}
			>
				<X className={tw.w_6.h_6} />
			</Button>
		</div>
	)
}
