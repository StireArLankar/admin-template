import * as React from 'react'

import { tv } from 'tailwind-variants'
import { tw } from 'typewind'

const inputClass =
	tw.flex.h_10.w_full.rounded_md.border.bg_transparent.py_1.px_3.text_sm.border_primary_700.text_primary_text
		.focus(tw.ring_primary_400.ring_offset_primary_900)
		.focus(tw.outline_none.ring_2.ring_primary_400.ring_offset_2)
		.placeholder(tw.text_primary_400)
		.disabled(tw.cursor_not_allowed.opacity_50)

const classes = tv({
	slots: {
		input: inputClass,
	},
})()

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, ...props }, ref) => (
		<input className={classes.input({ className })} ref={ref} {...props} />
	)
)

Input.displayName = 'Input'

export { Input }
