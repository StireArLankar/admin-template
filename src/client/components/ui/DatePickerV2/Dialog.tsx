import React, { PropsWithChildren } from 'react'
import { useDialog, AriaDialogProps } from 'react-aria'

export function Dialog({
	children,
	...props
}: AriaDialogProps & PropsWithChildren<{}>) {
	let ref = React.useRef<HTMLDivElement>(null)
	let { dialogProps } = useDialog(props, ref)

	return (
		<div {...dialogProps} ref={ref}>
			{children}
		</div>
	)
}
