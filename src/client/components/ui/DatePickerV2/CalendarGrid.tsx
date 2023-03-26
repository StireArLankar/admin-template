import { useMemo } from 'react'
import { useCalendarGrid, useLocale, AriaCalendarGridProps } from 'react-aria'
import { CalendarState } from 'react-stately'

import { getWeeksInMonth, startOfWeek, today } from '@internationalized/date'
import { tw } from 'typewind'

import { CalendarCell } from './CalendarCell'

export function CalendarGrid({
	state,
	...props
}: { state: CalendarState } & AriaCalendarGridProps) {
	const { locale } = useLocale()

	const weekDays = useMemo(() => {
		const weekStart = startOfWeek(today(state.timeZone), locale)
		const format = new Intl.DateTimeFormat(`en`, {
			weekday: 'short',
			timeZone: state.timeZone,
		})

		return [...new Array(7).keys()].map((index) => {
			const date = weekStart.add({ days: index })
			const dateDay = date.toDate(state.timeZone)
			return format.format(dateDay)
		})
	}, [locale, state.timeZone])

	const { headerProps, gridProps } = useCalendarGrid(props, state)

	// Get the number of weeks in the month so we can render the proper number of rows.
	const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale)

	return (
		<table {...gridProps} className={tw.table_fixed.w_full}>
			<thead {...headerProps}>
				<tr>
					{weekDays.map((day, index) => (
						<th className={tw.p_1.text_xs.w_0.text_center} key={index}>
							{day}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{[...new Array(weeksInMonth).keys()].map((weekIndex) => (
					<tr key={weekIndex}>
						{state
							.getDatesInWeek(weekIndex)
							.map((date, i) =>
								date ? (
									<CalendarCell
										key={date.toString()}
										state={state}
										date={date}
									/>
								) : (
									<td key={i} />
								)
							)}
					</tr>
				))}
			</tbody>
		</table>
	)
}
