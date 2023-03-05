import * as React from 'react'

import { tv, VariantProps } from 'tailwind-variants'
import { tw } from 'typewind'

const base =
	tw.border.border_transparent.inline_flex.items_center.justify_center.rounded_md.text_sm.font_medium.transition_colors
		.focus(tw.outline_none.ring_2.ring_offset_2)
		.hover(tw.bg_primary_800.text_primary_text)
		.focus(tw.ring_primary_400.ring_offset_primary_900)
		.disabled(tw.opacity_50.pointer_events_none)
		.variant('&[data-state=open]', tw.bg_primary_800)

const buttonVariants = tv({
	base: base,
	variants: {
		variant: {
			default: tw.bg_primary_50.text_primary_900.hover(tw.bg_primary_200),

			destructive: tw.bg_red_500.text_white.hover(tw.bg_red_600),

			outline: tw.hover(tw.bg_primary_800).bg_transparent.border
				.border_primary_700.text_primary_text,

			subtle: tw.bg_primary_700.text_primary_text.hover(tw.bg_primary_800),

			ghost: tw.bg_transparent.text_primary_text
				.hover(tw.bg_primary_800)
				.variant('&[data-state=open]', tw.bg_transparent),

			link: tw.hover(tw.underline.bg_transparent).bg_transparent
				.text_primary_text.underline_offset_4,
		},
		size: {
			default: tw.h_10.py_2.px_4,
			sm: tw.h_9.px_2.rounded_md,
			lg: tw.h_11.px_8.rounded_md,
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
})

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, ...props }, ref) => (
		<button
			className={buttonVariants({ variant, size, className })}
			ref={ref}
			{...props}
		/>
	)
)

Button.displayName = 'Button'

export { Button, buttonVariants }
