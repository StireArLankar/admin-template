import { PropsWithChildren, useRef } from 'react'
import {
	usePopover,
	Overlay,
	DismissButton,
	AriaPopoverProps,
} from 'react-aria'
import { OverlayTriggerState } from 'react-stately'

export function Popover(
	props: Omit<AriaPopoverProps, 'popoverRef'> & {
		state: OverlayTriggerState
	} & PropsWithChildren<{}>
) {
	let ref = useRef(null)
	let { state, children } = props

	let { popoverProps, underlayProps } = usePopover(
		{
			...props,
			popoverRef: ref,
		},
		state
	)

	return (
		<Overlay>
			<div {...underlayProps} className='fixed inset-0' />
			<div
				{...popoverProps}
				ref={ref}
				className='absolute top-full bg-white border border-gray-300 rounded-md shadow-lg mt-2 p-8 z-10'
			>
				<DismissButton onDismiss={state.close} />
				{children}
			</div>
		</Overlay>
	)
}
