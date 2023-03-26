import { useRef } from 'react'
import { useDatePicker } from 'react-aria'
import { DatePickerStateOptions, useDatePickerState } from 'react-stately'

import { CalendarDateTime } from '@internationalized/date'
import * as Popover from '@radix-ui/react-popover'
import { AlarmCheck, CalendarIcon } from 'lucide-react'
import { tw } from 'typewind'

import { AriaButton } from './AriaButton'
import { Calendar } from './Calendar'
import { DateField } from './DateField'

import { buttonVariants } from '@/components/ui/Button'

export function DatePicker(props: DatePickerStateOptions<CalendarDateTime>) {
	let state = useDatePickerState(props)
	let ref = useRef(null)
	let {
		groupProps,
		labelProps,
		fieldProps,
		buttonProps,
		dialogProps,
		calendarProps,
	} = useDatePicker(props, state, ref)

	return (
		<div className='relative text-left p-2'>
			<Popover.Root
				open={state.isOpen}
				onOpenChange={() => state.isOpen && state.close()}
			>
				<span {...labelProps}>{props.label}</span>

				<Popover.Anchor asChild>
					<div {...groupProps} ref={ref} className='flex group w-max'>
						<div
							className={buttonVariants({
								variant: 'outline',
								className:
									tw.flex.flex_1.tabular_nums.items_center.gap_4.whitespace_nowrap.justify_start.cursor_pointer
										.group_hover(
											tw.ring_1.ring_offset_1.ring_offset_primary_800
										)
										.group_focus_within(
											tw.ring_1.ring_offset_1.ring_offset_primary_800
										)
										.group_focus_within(
											tw.group_hover(tw.ring_offset_primary_800)
										),
							})}
						>
							<DateField {...fieldProps} hourCycle={24} />
							{state.validationState === 'invalid' && (
								<AlarmCheck className='w-6 h-6 text-red-500 absolute right-1' />
							)}
						</div>

						<AriaButton
							{...buttonProps}
							className={buttonVariants({
								variant: 'subtle',
								className: tw.ml_2.px_3.cursor_pointer,
							})}
						>
							<CalendarIcon className={tw.w_4.h_4} />
						</AriaButton>
					</div>
				</Popover.Anchor>

				<Popover.Content
					{...dialogProps}
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
						<Calendar {...calendarProps} />
					</div>
				</Popover.Content>
			</Popover.Root>
		</div>
	)
}
