import { useRef } from 'react'
import { useCalendar, useLocale } from 'react-aria'
import { CalendarStateOptions, useCalendarState } from 'react-stately'

import { createCalendar } from '@internationalized/date'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { tw } from 'typewind'

import { AriaButton } from './AriaButton'
import { CalendarGrid } from './CalendarGrid'

import { buttonVariants } from '@/components/ui/Button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/Select'

const SAFARI_OFFSET_FIX = 1
const getMonthsForLocale = (locale = navigator.language) => {
	const format = new Intl.DateTimeFormat(locale, { month: 'long' })
	const months = []
	for (let month = 0; month < 12; month++) {
		const testDate = new Date(0, month, 1 + SAFARI_OFFSET_FIX, 0, 0, 0)
		months.push(format.format(testDate))
	}
	return months
}

const months = getMonthsForLocale('en-US').map((month, index) => ({
	value: (index + 1).toString(),
	label: month,
}))

const currentYear = new Date().getFullYear() + 10
const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString())

export function Calendar(
	props: Omit<CalendarStateOptions, 'locale' | 'createCalendar'>
) {
	let { locale } = useLocale()
	let state = useCalendarState({
		...props,
		locale,
		createCalendar,
	})

	let ref = useRef(null)
	let res = useCalendar(props, state)

	const { calendarProps, prevButtonProps, nextButtonProps } = res

	return (
		<div
			{...calendarProps}
			ref={ref}
			className={tw.flex.flex_col.gap_2.max_w_['300px']}
		>
			<div className={tw.flex_1.flex.justify_center.gap_2.w_full.mb_2}>
				<AriaButton
					{...prevButtonProps}
					style={{ height: 'unset' }}
					className={buttonVariants({ size: 'sm', variant: 'outline' })}
				>
					<ChevronLeftIcon className={tw.w_['1.375rem'].h_['1.375rem']} />
				</AriaButton>
				{/* <Button
					size='sm'
					variant='outline'
					{...prevButtonProps}
					onClick={prevButtonProps.onPress as any}
					style={{ height: 'unset' }}
				>
					<ChevronLeftIcon className={tw.w_['1.375rem'].h_['1.375rem']} />
				</Button> */}

				<Select
					value={state.focusedDate.year.toString()}
					onValueChange={(value) => {
						state.setFocusedDate(
							state.focusedDate.set({ year: parseInt(value) })
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
					value={state.focusedDate.month.toString()}
					onValueChange={(value) => {
						state.setFocusedDate(
							state.focusedDate.set({ month: parseInt(value) })
						)
					}}
				>
					<SelectTrigger className={tw.flex_1}>
						<SelectValue placeholder='Month' />
					</SelectTrigger>
					<SelectContent>
						{months.map((month) => (
							<SelectItem key={month.value} value={month.value}>
								{month.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<AriaButton
					{...nextButtonProps}
					style={{ height: 'unset' }}
					className={buttonVariants({ size: 'sm', variant: 'outline' })}
				>
					<ChevronRightIcon className={tw.w_['1.375rem'].h_['1.375rem']} />
				</AriaButton>
				{/*
				<Button
					size='sm'
					variant='outline'
					{...nextButtonProps}
					onClick={nextButtonProps.onPress as any}
					style={{ height: 'unset' }}
				>
					<ChevronRightIcon className={tw.w_['1.375rem'].h_['1.375rem']} />
				</Button> */}
			</div>

			<CalendarGrid state={state} />
		</div>
	)
}
