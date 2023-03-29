import React, { useState } from 'react'

import { CalendarDateTime, parseAbsolute } from '@internationalized/date'

import { DatePicker } from './DatePicker'

export default function App() {
	const [state, setState] = useState<CalendarDateTime>()
	// const [state, setState] = React.useState(parseAbsolute("2023-05-03T12:02:00.000Z"))
	const [tog, toggle] = useState(false)

	return (
		<div>
			<h1
				onClick={() => {
					console.log(
						`123`,
						state &&
							state.set({ hour: 0, minute: 0 }).toDate('UTC').toISOString()
					)

					setState((e) => {
						if (!e) {
							return e
						}

						const iso = e
							.set({ hour: 0, minute: 0, second: 0 })
							.toDate('UTC')
							.toISOString()

						const date = parseAbsolute(iso, 'UTC')

						return date as unknown as CalendarDateTime
					})

					if (state) {
						toggle(!tog)
					}
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
