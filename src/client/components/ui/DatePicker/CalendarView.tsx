import { FC, useCallback, useMemo } from 'react'

import { useCalendar } from '@h6s/calendar'
import { useMachine } from '@xstate/react'
import {
	isSunday,
	isSameDay,
	addMonths,
	isFuture,
	isPast,
	setDate,
} from 'date-fns'
import format from 'date-fns/format'
import isWithinInterval from 'date-fns/isWithinInterval'
import {
	ChevronRight as ChevronRightIcon,
	ChevronLeft as ChevronLeftIcon,
} from 'lucide-react'
import { tv } from 'tailwind-variants'
import { tw } from 'typewind'

import { Button } from '@/components/ui/Button'
import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
	SelectItem,
} from '@/components/ui/Select'

const cellClass = tv({
	base: tw.p_1.duration_75.text_xs.text_center.w_full.h_7.border
		.border_primary_600,

	variants: {
		currentDate: {
			true: 'font-bold',
		},
		otherMonthAndEnabled: {
			true: 'opacity-50',
		},
		isNotEnabled: {
			true: 'opacity-25 cursor-not-allowed',
		},

		isStart: {
			true: tw.bg_primary_900.rounded_l_md.text_primary_text,
		},
		isEnd: {
			true: tw.bg_primary_900.rounded_r_md.text_primary_text,
		},
		notEndOrStart: {
			true: 'rounded-md',
		},
		isInRange: {
			true: tw.bg_primary_900.text_primary_text,
		},
		isHoverable: {
			true: tw.cursor_pointer.hover(tw.bg_primary_800),
		},
		isSunday: {
			true: tw.text_red_500.hover(tw.text_red_500),
		},
	},
})

type CalendarMachine = typeof useMachine

interface DatePickerViewProps {
	calendar: ReturnType<typeof useCalendar>
	state: ReturnType<CalendarMachine>
	showMonthName?: boolean
	onPrev?(): void
	onNext?(): void

	disablePast?: boolean
	disableFuture?: boolean
}

const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((m) =>
	format(new Date(1970, m), 'MMMM')
)
const currentYear = new Date().getFullYear() + 10
const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString())

const DatePickerCalendarView: FC<DatePickerViewProps> = ({
	state,
	showMonthName = false,
	calendar: { headers, body, ...calendar },
	onPrev,
	onNext,
	disablePast = false,
	disableFuture = false,
}) => {
	const [current, send] = state

	const isStart = (date: Date) => isSameDay(current.context.start, date)

	const isEnd = (date: Date) => isSameDay(current.context.end, date)

	const isEnabled = useCallback(
		(date: Date | number) => {
			if (isSameDay(Date.now(), date)) {
				return true
			}

			if (disableFuture && isFuture(date)) {
				return false
			}

			if (disablePast && isPast(date)) {
				return false
			}

			return true
		},
		[disableFuture, disablePast]
	)

	const canNext = useMemo(() => {
		const { weekIndex, dateIndex } = calendar.today
		const date = calendar.getDateCellByIndex(weekIndex, dateIndex).value
		let nextMonth = addMonths(date, 1)
		nextMonth = setDate(nextMonth, 1)

		return isEnabled(nextMonth)
	}, [calendar, isEnabled])

	const canPrev = useMemo(() => {
		const { weekIndex, dateIndex } = calendar.today
		const date = calendar.getDateCellByIndex(weekIndex, dateIndex).value
		const prevMonth = setDate(date, 0)

		return isEnabled(prevMonth)
	}, [calendar, isEnabled])

	const isInRange = (value: Date) =>
		current.value === 'DONE' &&
		!isSameDay(current.context.start ?? 0, value) &&
		!isSameDay(current.context.end ?? 0, value) &&
		isWithinInterval(value, {
			start: current.context.start ?? 0,
			end: current.context.end ?? 0,
		})

	const isHoverable = (value: Date): boolean => {
		if (!isEnabled(value) || isStart(value) || isEnd(value)) {
			return false
		}

		if (current.value === 'DONE') {
			return !isInRange(value)
		}

		return true
	}

	return (
		<div className={tw.flex.flex_col.gap_2.max_w_['300px']}>
			{showMonthName && (
				<div className={tw.flex_1.flex.justify_center.gap_2.w_full.mb_2}>
					{onPrev && (
						<Button
							size='sm'
							variant='outline'
							onClick={onPrev}
							disabled={!canPrev}
							className={tw.h_full}
						>
							<ChevronLeftIcon className={tw.w_['1.375rem'].h_['1.375rem']} />
						</Button>
					)}

					<Select
						value={calendar.cursorDate.getFullYear().toString()}
						onValueChange={(value) => {
							calendar.navigation.setDate(
								new Date(parseInt(value), calendar.month)
							)
						}}
					>
						<SelectTrigger className={tw.w_max.gap_1.font_mono}>
							<SelectValue placeholder='Year' />
						</SelectTrigger>

						<SelectContent className={tw.font_mono}>
							{years.map((value) => (
								<SelectItem key={value} value={value}>
									{value}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={calendar.cursorDate.getMonth().toString()}
						onValueChange={(value) => {
							calendar.navigation.setDate(
								new Date(calendar.year, parseInt(value))
							)
						}}
					>
						<SelectTrigger className={tw.flex_1}>
							<SelectValue placeholder='Month' />
						</SelectTrigger>
						<SelectContent>
							{months.map((label, value) => (
								<SelectItem key={value} value={value.toString()}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{onNext && (
						<Button
							size='sm'
							variant='outline'
							onClick={onNext}
							disabled={!canNext}
							className={tw.h_full}
						>
							<ChevronRightIcon className={tw.w_['1.375rem'].h_['1.375rem']} />
						</Button>
					)}
				</div>
			)}

			<table className={tw.table_fixed.w_full}>
				<thead>
					<tr>
						{headers.weekDays.map(({ key, value }) => (
							<th className={tw.p_1.text_xs.w_0} key={key}>
								{format(value, 'E')}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{body.value.map(({ value: days, key }) => (
						<tr key={key}>
							{days.map(({ key, value, ...day }) => (
								<td key={key} className={tw.w_0.p_1}>
									<Button
										variant='subtle'
										className={cellClass({
											currentDate: day.isCurrentDate,
											otherMonthAndEnabled:
												!day.isCurrentMonth && isEnabled(value),
											isNotEnabled: !isEnabled(value),
											isSunday: isSunday(value),
											isStart: isStart(value),
											isEnd: isEnd(value),
											isInRange: isInRange(value),
											isHoverable: isHoverable(value),
											notEndOrStart:
												!current.context.start || !current.context.end,
										})}
										onClick={() => {
											if (!isEnabled(value)) {
												return
											}

											if (current.can('SELECT_START')) {
												send('SELECT_START', { start: value.getTime() })
											}

											if (current.can('SELECT_END')) {
												send('SELECT_END', { end: value.getTime() })
											}
										}}
									>
										{day.date}
									</Button>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default DatePickerCalendarView
