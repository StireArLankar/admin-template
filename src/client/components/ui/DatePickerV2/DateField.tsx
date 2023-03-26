import { useRef } from 'react'
import { useDateField, useDateSegment, useLocale } from 'react-aria'
import {
	DateFieldState,
	DateFieldStateOptions,
	DateSegment,
	useDateFieldState,
} from 'react-stately'

import { createCalendar } from '@internationalized/date'

export function DateField(
	props: Omit<DateFieldStateOptions, 'locale' | 'createCalendar'>
) {
	let { locale } = useLocale()
	let state = useDateFieldState({
		...props,
		locale,
		createCalendar,
	})

	let ref = useRef(null)
	let { fieldProps } = useDateField(props, state, ref)

	return (
		<div {...fieldProps} ref={ref} className='flex font-mono'>
			{state.segments.map((segment, i) => (
				<DateSegmentComponent key={i} segment={segment} state={state} />
			))}
		</div>
	)
}

function DateSegmentComponent({
	segment,
	state,
}: {
	segment: DateSegment
	state: DateFieldState
}) {
	let ref = useRef(null)
	let { segmentProps } = useDateSegment(segment, state, ref)

	return (
		<div
			{...segmentProps}
			ref={ref}
			style={{
				...segmentProps.style,
				minWidth:
					segment.maxValue != null
						? String(segment.maxValue).length + 'ch'
						: undefined,
			}}
			className={`px-0.5 box-content tabular-nums text-right outline-none rounded-sm focus:bg-violet-600 focus:text-white group`}
		>
			{/* Always reserve space for the placeholder, to prevent layout shift when editing. */}
			<span
				aria-hidden='true'
				className='block w-full text-center italic group-focus:text-white'
				style={{
					visibility: segment.isPlaceholder ? undefined : 'hidden',
					height: segment.isPlaceholder ? '' : 0,
					pointerEvents: 'none',
				}}
			>
				{segment.placeholder}
			</span>
			{segment.isPlaceholder ? '' : segment.text === '.' ? '/' : segment.text}
		</div>
	)
}
