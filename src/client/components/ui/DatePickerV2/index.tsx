import React from 'react'

import { CalendarDateTime, parseAbsolute } from '@internationalized/date'

import { DatePicker } from './DatePicker'

export default function App() {
	const [state, setState] = React.useState<CalendarDateTime | undefined>(
		undefined
	)
	// const [state, setState] = React.useState(parseAbsolute("2023-05-03T12:02:00.000Z"))
	const [tog, toggle] = React.useState(false)

	return (
		<div>
			<h1
				onClick={() => {
					console.log(
						`123`,
						state &&
							state.set({ hour: 0, minute: 0 }).toDate('UTC').toISOString()
					)
					setState((e) =>
						e
							? (parseAbsolute(
									e
										.set({ hour: 0, minute: 0, second: 0 })
										.toDate('UTC')
										.toISOString(),
									'UTC'
							  ) as any)
							: e
					)
					toggle(!tog)
				}}
			>
				DatePicker
			</h1>
			<DatePicker
				label='Appointment date and time'
				value={state}
				hideTimeZone
				granularity={tog ? 'minute' : 'day'}
				onChange={(e) => {
					setState(e)
				}}
			/>
			{state && state.toDate('UTC').toISOString()}
		</div>
	)
}
