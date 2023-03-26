import { useRef } from 'react'
import {
	AriaCalendarCellProps,
	mergeProps,
	useCalendarCell,
	useFocusRing,
	useLocale,
} from 'react-aria'
import { CalendarState } from 'react-stately'

import { isSameMonth, isToday, isWeekend } from '@internationalized/date'
import { tw } from 'typewind'

import { buttonVariants } from '@/components/ui/Button'
import { cellClass } from '@/components/ui/DatePicker/CalendarView'

export function CalendarCell({
	state,
	date,
}: AriaCalendarCellProps & { state: CalendarState }) {
	const ref = useRef(null)
	const { cellProps, buttonProps, isDisabled, formattedDate, isSelected } =
		useCalendarCell({ date }, state, ref)

	let { focusProps } = useFocusRing()

	const { locale } = useLocale()

	return (
		<td {...cellProps} className={tw.w_0.p_1}>
			<div
				{...mergeProps(buttonProps, focusProps)}
				ref={ref}
				className={buttonVariants({
					className: cellClass({
						currentDate: isToday(date, state.timeZone),
						otherMonthAndEnabled:
							!isSameMonth(date, state.focusedDate) && !isDisabled,
						isNotEnabled: isDisabled,
						isSunday: isWeekend(date, locale),
						isInRange: isSelected,
						isHoverable: true,
					}),
					variant: 'subtle',
					size: 'sm',
				})}
			>
				{formattedDate}
			</div>
		</td>
	)
}
