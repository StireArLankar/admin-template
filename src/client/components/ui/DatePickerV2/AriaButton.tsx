import { useRef } from 'react'
import { AriaButtonProps, useButton } from 'react-aria'

export const AriaButton = ({
	className,
	style,
	...props
}: AriaButtonProps<'button'> & {
	className?: string
	style?: React.CSSProperties
}) => {
	const ref = useRef(null)
	const { buttonProps } = useButton(props, ref)

	return (
		<button {...buttonProps} className={className} style={style} ref={ref}>
			{props.children}
		</button>
	)
}
