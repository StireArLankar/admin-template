import { useMemo, useRef } from 'react'

import { useCalendar } from '@h6s/calendar'
import { Root as Menubar } from '@radix-ui/react-menubar'
import * as Popover from '@radix-ui/react-popover'
import { useMachine } from '@xstate/react'
import copy from 'copy-to-clipboard'
import {
	endOfDay,
	endOfMonth,
	endOfYear,
	startOfDay,
	startOfMonth,
	startOfYear,
	subDays,
	subMonths,
} from 'date-fns'
import format from 'date-fns/format'
import {
	Calendar as CalendarIcon,
	Clipboard,
	ClipboardCopy,
	X,
} from 'lucide-react'
import { tv } from 'tailwind-variants'
import { tw } from 'typewind'

import DatePickerCalendarView from './CalendarView'
import { datePickerMachine, DatesRange } from './state'

import { Button } from '@/components/ui/Button'
import {
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarShortcut,
	MenubarTrigger,
} from '@/components/ui/MenuBar'
import { checkNever } from '~common/utils/checkNever'

const classes = {
	root: tv({ base: tw.flex.gap_2 }),
}

type Month = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

type IDateRangePickerProps = {
	onChange?: (range?: Partial<DatesRange>) => void
	value?: Partial<DatesRange>
	className?: string
	disable?: 'past' | 'future' | 'today'
	fixedYear?: number
	allowedMonths?: Month[]
}

type Period = 'TODAY' | '7DAYS' | '14DAYS' | '30DAYS' | 'MONTH' | 'YEAR'

function DateRangePicker(props: IDateRangePickerProps) {
	// const breakpoint = useBreakpoint()

	const defaultDateLeft = useMemo(() => {
		const today = new Date()

		if (props.disable === 'future') {
			return subMonths(today, 1)
		}

		return today
	}, [props.disable])

	const calendarLeft = useCalendar({
		defaultDate: defaultDateLeft,
		defaultWeekStart: 1,
	})

	const state = useMachine(datePickerMachine)
	const [current, send] = state

	const isPast = props.disable === 'past'

	const selectPeriod = (period: Period) => () => {
		let today = startOfDay(new Date())

		if (isPast) {
			return
		}

		const range = (() => {
			switch (period) {
				case 'TODAY':
					return {
						start: today,
						end: today,
					}

				case '7DAYS':
					return {
						start: subDays(today, 7),
						end: today,
					}

				case '14DAYS':
					return {
						start: subDays(today, 14),
						end: today,
					}

				case '30DAYS':
					return {
						start: subDays(today, 30),
						end: today,
					}

				case 'MONTH':
					return {
						start: startOfMonth(subMonths(today, 1)),
						end: endOfMonth(subMonths(today, 1)),
					}

				case 'YEAR':
					return {
						start: startOfYear(today),
						end: endOfYear(today),
					}

				default:
					checkNever(period)
					return {
						start: startOfYear(today),
						end: endOfYear(today),
					}
			}
		})()

		calendarLeft.navigation.setDate(range.end)

		send('SET_RANGE', { range })
	}

	const onChange = useRef(props.onChange)
	onChange.current = props.onChange

	const currentContext = useRef(current.context)
	currentContext.current = current.context

	const onOpenChange = (isOpen: boolean) => {
		// if (current.matches("DONE"))
		// if (!isOpen && current.value !== 'DONE') {
		// 	send('CANCEL')
		// 	onChange.current?.()
		// 	calendarLeft.navigation.setDate(defaultDateLeft)
		// 	return
		// }

		if (isOpen) {
			return
		}

		const anyDate = currentContext.current.end
			? new Date(currentContext.current.end)
			: currentContext.current.start
			? new Date(currentContext.current.start)
			: defaultDateLeft

		calendarLeft.navigation.setDate(anyDate)
		onChange.current?.(currentContext.current)
	}

	const cancel = () => {
		if (!current.can('CANCEL')) {
			return
		}

		onChange.current?.()
		send('CANCEL')
	}

	const isPlaceholder = (kind: 'start' | 'end'): boolean =>
		current.context[kind] === undefined

	return (
		<div className={classes.root({ className: props.className })}>
			<Popover.Root onOpenChange={onOpenChange}>
				<Popover.Trigger asChild>
					<Button
						variant='outline'
						className={
							tw.flex.flex_1.tabular_nums.items_center.gap_4.whitespace_nowrap
								.justify_start
						}
					>
						{/* <CalendarIcon className='h-4' /> */}

						<span
							className={
								isPlaceholder('start')
									? tw.opacity_50.tracking_['0.008rem']
									: ''
							}
						>
							{current.context.start
								? format(current.context.start, 'dd/MM/yyyy')
								: `-- / -- / ----`}
						</span>

						<span
							className={
								isPlaceholder('end') ? tw.opacity_50.tracking_['0.008rem'] : ''
							}
						>
							{current.context.end
								? format(current.context.end, 'dd/MM/yyyy')
								: `-- / -- / ----`}
						</span>
					</Button>
				</Popover.Trigger>

				<Popover.Content
					sideOffset={3}
					collisionPadding={8}
					side='bottom'
					align='start'
					className={
						tw.z_50.flex.flex_col.p_4.border.rounded_lg.bg_primary_800
							.border_primary_600
					}
				>
					<div className='grid grid-cols-1 gap-8'>
						<DatePickerCalendarView
							calendar={calendarLeft}
							onPrev={calendarLeft.navigation.toPrev}
							onNext={calendarLeft.navigation.toNext}
							state={state}
							showMonthName
							disableFuture={props.disable === 'future'}
							disablePast={props.disable === 'past'}
						/>
					</div>

					<div className='flex items-center justify-center w-full gap-4 mt-4'>
						<Button variant='outline' size='sm' onClick={selectPeriod('TODAY')}>
							Today
						</Button>
						<Button
							variant='outline'
							disabled={props.disable === 'past'}
							size='sm'
							onClick={selectPeriod('7DAYS')}
						>
							Past 7 days
						</Button>
						<Button
							variant='outline'
							disabled={props.disable === 'past'}
							size='sm'
							onClick={selectPeriod('30DAYS')}
						>
							Past 30 days
						</Button>
					</div>
				</Popover.Content>
			</Popover.Root>

			<Menubar onValueChange={(value) => {}}>
				<MenubarMenu>
					<MenubarTrigger asChild>
						<Button variant='subtle' className={tw.px_3.cursor_pointer}>
							{/* <X className={tw.w_4.h_4} /> */}
							<CalendarIcon className={tw.w_4.h_4} />
							{/* <ChevronDown className={tw.w_4.h_4} /> */}
						</Button>
					</MenubarTrigger>

					<MenubarContent align='end' sideOffset={3} alignOffset={0} loop>
						<MenubarItem className={tw.cursor_pointer} onSelect={cancel}>
							Clear
							<MenubarShortcut>
								<X className={tw.w_4.h_4} />
							</MenubarShortcut>
						</MenubarItem>
						<MenubarItem
							className={tw.cursor_pointer}
							disabled={!current.context.start}
							onSelect={(e) => {
								e.preventDefault()
								const num = current.context.start

								if (!num) {
									return
								}

								const date = new Date(num)

								const formatted = format(date, "yyyy-MM-dd'T'00:00:00.000'Z'")

								return copy(formatted)
							}}
						>
							Copy start
							<MenubarShortcut>
								<Clipboard className={tw.w_4.h_4} />
							</MenubarShortcut>
						</MenubarItem>
						<MenubarItem
							className={tw.cursor_pointer}
							disabled={!current.context.end}
							onSelect={(e) => {
								e.preventDefault()
								const num = current.context.end

								if (!num) {
									return
								}

								const date = endOfDay(new Date(num))

								const formatted = format(date, "yyyy-MM-dd'T'23:59:59.999'Z'")

								return copy(formatted)
							}}
						>
							Copy end
							<MenubarShortcut>
								<Clipboard className={tw.w_4.h_4} />
							</MenubarShortcut>
						</MenubarItem>

						<MenubarItem
							className={tw.cursor_pointer}
							onSelect={async () => {
								try {
									const res = await navigator.clipboard.readText()

									const isISODate = isIsoDate(res)

									if (isISODate) {
										const date = new Date(res.slice(0, 10))
										const res123 = send('INSERT_START', { start: date })
										onChange.current?.(res123.context)
										return
									}

									const date = new Date(res)

									if (isNaN(date.getTime())) {
										return
									}

									const res123 = send('INSERT_START', { start: date })

									onChange.current?.(res123.context)
								} catch (e) {}
							}}
						>
							Insert start
							<MenubarShortcut>
								<ClipboardCopy className={tw.w_4.h_4} />
							</MenubarShortcut>
						</MenubarItem>

						<MenubarItem
							className={tw.cursor_pointer}
							disabled={!current.context.start}
							onSelect={async () => {
								try {
									const res = await navigator.clipboard.readText()

									const isISODate = isIsoDate(res)

									if (isISODate) {
										const date = new Date(res.slice(0, 10))
										const res123 = send('INSERT_END', { end: date })
										onChange.current?.(res123.context)
										return
									}

									const date = new Date(res)

									if (isNaN(date.getTime())) {
										return
									}

									const res123 = send('INSERT_END', { end: date })

									onChange.current?.(res123.context)
								} catch (e) {}
							}}
						>
							Insert end
							<MenubarShortcut>
								<ClipboardCopy className={tw.w_4.h_4} />
							</MenubarShortcut>
						</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>
		</div>
	)
}

export default DateRangePicker

function isIsoDate(str: string) {
	if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) {
		return false
	}

	const d = new Date(str)
	return d instanceof Date && !isNaN(+d) && d.toISOString() === str // valid date
}
