// import { useCallback, useMemo, useRef } from 'react'

// import { useCalendar } from '@h6s/calendar'
// import * as Popover from '@radix-ui/react-popover'
// import { useMachine } from '@xstate/react'
// import {
// 	addMonths,
// 	subDays,
// 	startOfMonth,
// 	setHours,
// 	setMinutes,
// 	subMonths,
// 	endOfMonth,
// 	startOfYear,
// 	endOfYear,
// } from 'date-fns'
// import format from 'date-fns/format'
// import { Calendar as CalendarIcon } from 'lucide-react'
// import { tv } from 'tailwind-variants'
// import { tw } from 'typewind'

// import DatePickerCalendarView from './CalendarView'
// import { datePickerMachine, DatesRange } from './state'

// import { Button } from '@/components/ui/Button'
// import { checkNever } from '~common/utils/checkNever'

// const classes = {
// 	root: tv({ base: 'flex items-center justify-start' }),
// }

// type Month = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

// type IDateRangePickerProps = {
// 	onChange?: (range?: DatesRange) => void
// 	value?: DatesRange
// 	className?: string
// 	disable?: 'past' | 'future' | 'today'
// 	fixedYear?: number
// 	allowedMonths?: Month[]
// }

// type Period = 'TODAY' | '7DAYS' | '14DAYS' | '30DAYS' | 'MONTH' | 'YEAR'

// function DateRangePicker(props: IDateRangePickerProps) {
// 	// const breakpoint = useBreakpoint()

// 	const defaultDateLeft = useMemo(() => {
// 		const today = Date.now()

// 		if (props.disable === 'future') {
// 			return subMonths(today, 1)
// 		}

// 		return today
// 	}, [props.disable])

// 	const defaultDateRight = useMemo(() => {
// 		const today = Date.now()

// 		if (props.disable === 'future') {
// 			return today
// 		}

// 		return addMonths(today, 1)
// 	}, [props.disable])

// 	const calendarLeft = useCalendar({
// 		defaultDate: defaultDateLeft,
// 		defaultWeekStart: 1,
// 	})
// 	const calendarRight = useCalendar({
// 		defaultDate: defaultDateRight,
// 		defaultWeekStart: 1,
// 	})

// 	const state = useMachine(datePickerMachine)
// 	const [current, send] = state

// 	const toPrev = useCallback(() => {
// 		calendarLeft.navigation.toPrev()
// 		calendarRight.navigation.toPrev()
// 	}, [calendarLeft, calendarRight])

// 	const toNext = useCallback(() => {
// 		calendarLeft.navigation.toNext()
// 		calendarRight.navigation.toNext()
// 	}, [calendarLeft, calendarRight])

// 	const setDate = useCallback(
// 		(date: Date | number) => {
// 			const leftDate = new Date(date)
// 			const rightDate = addMonths(date, 1)

// 			calendarLeft.navigation.setDate(leftDate)
// 			calendarRight.navigation.setDate(rightDate)
// 		},
// 		[calendarLeft.navigation, calendarRight.navigation]
// 	)

// 	const setToday = useCallback(() => {
// 		setDate(Date.now())
// 	}, [setDate])

// 	const isPast = props.disable === 'past'

// 	const selectPeriod = useCallback(
// 		(period: Period) => () => {
// 			let today = new Date()

// 			today = setHours(today, 0)
// 			today = setMinutes(today, 0)

// 			if (isPast) {
// 				return
// 			}

// 			const range = (() => {
// 				switch (period) {
// 					case 'TODAY':
// 						return {
// 							start: today.getTime(),
// 							end: today.getTime(),
// 						}

// 					case '7DAYS':
// 						return {
// 							start: subDays(today, 7).getTime(),
// 							end: today.getTime(),
// 						}

// 					case '14DAYS':
// 						return {
// 							start: subDays(today, 14).getTime(),
// 							end: today.getTime(),
// 						}

// 					case '30DAYS':
// 						return {
// 							start: subDays(today, 30).getTime(),
// 							end: today.getTime(),
// 						}

// 					case 'MONTH':
// 						return {
// 							start: startOfMonth(subMonths(today, 1)),
// 							end: endOfMonth(subMonths(today, 1)),
// 						}

// 					case 'YEAR':
// 						return {
// 							start: startOfYear(today),
// 							end: endOfYear(today),
// 						}

// 					default:
// 						checkNever(period)
// 						return {
// 							start: startOfYear(today),
// 							end: endOfYear(today),
// 						}
// 				}
// 			})()

// 			send('SET_RANGE', { range })
// 		},
// 		// [calendarLeft, setToday, current, send, isPast]
// 		[send, isPast]
// 	)

// 	const onChange = useRef(props.onChange)
// 	onChange.current = props.onChange

// 	const currentContext = useRef(current.context)
// 	currentContext.current = current.context

// 	const onOpenChange = useCallback(
// 		(isOpen: boolean) => {
// 			if (!isOpen && current.value !== 'DONE') {
// 				send('CANCEL')
// 				onChange.current?.()
// 				return
// 			}

// 			onChange.current?.(currentContext.current as any)
// 		},
// 		[current.value, send]
// 	)

// 	const cancel = useCallback(() => {
// 		if (!current.can('CANCEL')) {
// 			return
// 		}

// 		onChange.current?.()
// 		send('CANCEL')
// 	}, [send, current])

// 	const isPlaceholder = (kind: 'start' | 'end'): boolean =>
// 		current.context[kind] === undefined

// 	return (
// 		<div className={classes.root({ className: props.className })}>
// 			<Popover.Root onOpenChange={onOpenChange}>
// 				<Popover.Trigger asChild>
// 					<Button
// 						variant='outline'
// 						className='flex flex-1 tabular-nums items-center justify-between gap-4 rounded-r-none border-r-0'
// 					>
// 						<CalendarIcon className='h-4' />

// 						<div className='mr-auto space-x-4'>
// 							<span className={isPlaceholder('start') ? 'opacity-50' : ''}>
// 								{current.context.start
// 									? format(current.context.start, 'dd/MM/yyyy')
// 									: `-- / -- / ----`}
// 							</span>

// 							<span className={isPlaceholder('end') ? 'opacity-50' : ''}>
// 								{current.context.end
// 									? format(current.context.end, 'dd/MM/yyyy')
// 									: `-- / -- / ----`}
// 							</span>
// 						</div>
// 					</Button>
// 				</Popover.Trigger>
// 				<Popover.Content
// 					sideOffset={9}
// 					collisionPadding={8}
// 					side='bottom'
// 					align='start'
// 					className={
// 						tw.z_50.flex.flex_col.p_4.border.rounded_lg.bg_primary_800
// 							.text_pink_800.border_primary_600
// 					}
// 					about='date-picker content'
// 				>
// 					{/* <div className='md:grid-cols-2 grid grid-cols-1 gap-8'> */}
// 					<div className='grid grid-cols-1 gap-8'>
// 						<DatePickerCalendarView
// 							{...{
// 								calendar: calendarLeft,
// 								onPrev: toPrev,
// 								// onNext: breakpoint <= Breakpoint.MD ? toNext : undefined,
// 								onNext: toNext,
// 								state,
// 								showMonthName: true,
// 								disableFuture: props.disable === 'future',
// 								disablePast: props.disable === 'past',
// 							}}
// 						/>
// 						{/* <DatePickerCalendarView
// 							{...{
// 								calendar: calendarRight,
// 								state,
// 								// onNext: breakpoint >= Breakpoint.MD ? toNext : undefined,
// 								onNext: toNext,
// 								showMonthName: true,
// 								disableFuture: props.disable === 'future',
// 								disablePast: props.disable === 'past',
// 							}}
// 						/> */}
// 					</div>
// 					<div className='flex items-center justify-center w-full gap-4 mt-4'>
// 						<Button size='sm' onClick={selectPeriod('TODAY')}>
// 							Today
// 						</Button>
// 						<Button
// 							disabled={props.disable === 'past'}
// 							size='sm'
// 							onClick={selectPeriod('7DAYS')}
// 						>
// 							Past 7 days
// 						</Button>
// 						{/* <Button
// 							disabled={props.disable === 'past'}
// 							size='sm'
// 							onClick={selectPeriod('14DAYS')}
// 						>
// 							Last 14 days
// 						</Button>
// 						<Button
// 							disabled={props.disable === 'past'}
// 							size='sm'
// 							onClick={selectPeriod('30DAYS')}
// 						>
// 							Last 30 days
// 						</Button>
// 						<Button
// 							disabled={props.disable === 'past'}
// 							size='sm'
// 							onClick={selectPeriod('MONTH')}
// 						>
// 							Last month
// 						</Button>
// 						<Button
// 							disabled={props.disable === 'past'}
// 							size='sm'
// 							onClick={selectPeriod('YEAR')}
// 						>
// 							Last year
// 						</Button> */}
// 					</div>
// 				</Popover.Content>
// 			</Popover.Root>
// 			<Button
// 				variant='subtle'
// 				className={'border-l-0 rounded-l-none'}
// 				onClick={cancel}
// 			>
// 				&times;
// 			</Button>
// 		</div>
// 	)
// }

// export default DateRangePicker
export {}
